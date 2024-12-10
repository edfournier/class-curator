package com.group.project.controller;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.FriendRequest;
import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendRequestRepository;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.utils.PeopleUtils;

@RestController
@RequestMapping("/private/friend")
public class FriendController {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final FriendshipRepository friendshipRepository;

    @Autowired
    private final FriendRequestRepository friendRequestRepository;

    public FriendController(UserRepository userRepository, FriendshipRepository friendshipRepository,
            FriendRequestRepository friendRequestRepository) {
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.friendRequestRepository = friendRequestRepository;
    }

    @GetMapping
    public ResponseEntity<Object> getFriends(@RequestAttribute User currentUser) {
        return ResponseEntity.ok(PeopleUtils.getAllFriends(friendshipRepository, currentUser));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<Object> deleteFriendship(@RequestAttribute User currentUser, @PathVariable long friendId) {
        User friend = userRepository.findById(friendId).orElse(null);

        // Return 404 if friend does not exist
        if (friend == null)
            return ResponseEntity.notFound().build();

        Friendship friendship = PeopleUtils.getExistingFriendship(friendshipRepository, currentUser, friend);

        // Return 404 if friendship does not exist
        if (friendship == null)
            return ResponseEntity.notFound().build();

        friendshipRepository.delete(friendship);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/request")
    public ResponseEntity<Object> getReceivedFriendRequests(@RequestAttribute User currentUser) {
        List<FriendRequest> receivedFriendRequests = friendRequestRepository.findByReceiver(currentUser);
        List<User> potentialFriends = receivedFriendRequests.stream()
                .flatMap(friendRequest -> Stream.of(friendRequest.getSender())).toList();
        return ResponseEntity.ok(potentialFriends);
    }

    @PostMapping("/request/{senderId}/accept")
    public ResponseEntity<Object> acceptReceivedFriendRequest(@RequestAttribute User currentUser,
            @PathVariable long senderId) {
        User sender = userRepository.findById(senderId).orElse(null);

        // Return 404 if sender does not exist
        if (sender == null)
            return ResponseEntity.notFound().build();

        // Return 400 if friendship exists
        if (PeopleUtils.getExistingFriendship(friendshipRepository, currentUser, sender) != null)
            return ResponseEntity.badRequest().body("Friendship already exists!");

        // Return 404 if friendRequest does not exist
        if (!friendRequestRepository.findBySenderAndReceiver(sender, currentUser).isPresent())
            return ResponseEntity.notFound().build();

        Friendship friendship = new Friendship(currentUser, sender);
        friendRequestRepository.removeBySenderAndReceiver(sender, currentUser);
        friendshipRepository.save(friendship);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request/{targetId}")
    public ResponseEntity<Object> createFriendRequest(@RequestAttribute User currentUser, @PathVariable long targetId) {
        User targetUser = userRepository.findById(targetId).orElse(null);

        // Return 404 if target user does not exist
        if (targetUser == null)
            return ResponseEntity.notFound().build();

        // Return 400 if friendship exists
        if (PeopleUtils.getExistingFriendship(friendshipRepository, currentUser, targetUser) != null)
            return ResponseEntity.badRequest().body("Friendship already exists!");

        // Return 200 if friend request had already been sent
        if (friendRequestRepository.findBySenderAndReceiver(currentUser, targetUser).isPresent())
            return ResponseEntity.ok().build();

        // Create friendship if friend request from target already exists
        // (think: handshake)
        if (friendRequestRepository.findBySenderAndReceiver(targetUser, currentUser).isPresent()) {
            return acceptReceivedFriendRequest(targetUser, currentUser.getId());
        }

        // Create friend request
        FriendRequest friendRequest = new FriendRequest(currentUser, targetUser);
        friendRequestRepository.save(friendRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/request/{senderId}")
    public ResponseEntity<Object> deleteReceivedFriendRequest(@RequestAttribute User currentUser,
            @PathVariable long senderId) {
        User sender = userRepository.findById(senderId).orElse(null);

        // Return 404 if sender does not exist
        if (sender == null)
            return ResponseEntity.notFound().build();

        FriendRequest friendRequest = friendRequestRepository.findBySenderAndReceiver(sender, currentUser).orElse(null);

        // Return 404 if friend request does not exist
        if (friendRequest == null)
            return ResponseEntity.notFound().build();

        friendRequestRepository.delete(friendRequest);
        return ResponseEntity.ok().build();
    }
}