package com.group.project.controller;

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserRepository;

@RestController
@RequestMapping("/private/friendship")
public class FriendshipController {

    @Autowired
    private final FriendshipRepository friendshipRepository;
    @Autowired
    private final UserRepository userRepository;

    public FriendshipController(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public List<User> getFriends(@RequestAttribute Long id) {
        // TODO: Handle null user
        User user = userRepository.findById(id).orElseThrow();

        // Friendships are a undirected graph
        List<Friendship> leftHalf = friendshipRepository.findByUser1(user);
        List<Friendship> rightHalf = friendshipRepository.findByUser2(user);
        Stream<User> leftHalfFriends = leftHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser2()));
        Stream<User> rightHalfFriends = rightHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser1()));
        Stream<User> friendsStream = Stream.concat(leftHalfFriends, rightHalfFriends);
        return friendsStream.toList();
    }

    @PostMapping
    public ResponseEntity<Object> createFriendship(@RequestBody User user, @RequestBody String user_2_username)
            throws URISyntaxException {
        // TODO: Handle null user
        // TODO: Handle null user2
        // TODO: Handle authenticated user
        User user1 = userRepository.findByUsername(user.getUsername()).orElseThrow();
        User user2 = userRepository.findByUsername(user_2_username).orElseThrow();

        // Because unidirectional graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }
        Friendship friendship = new Friendship(user1, user2);
        friendshipRepository.save(friendship);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{user_2_username}")
    public ResponseEntity<Object> deleteFriendship(@RequestBody User user, @RequestAttribute String user_2_username) {
        // TODO: Handle null user
        // TODO: Handle null user2
        // TODO: Handle authenticated user
        User user1 = userRepository.findByUsername(user.getUsername()).orElseThrow();
        User user2 = userRepository.findByUsername(user_2_username).orElseThrow();

        // Because unidirectional graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }

        // TODO: Handle missing friendship
        Friendship friendship = friendshipRepository.findByUser1AndUser2(user1, user2).orElseThrow();

        friendshipRepository.delete(friendship);
        return ResponseEntity.ok().build();
    }
}