package com.group.project.controller;  

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private/users")  
public class FriendController {

    private final FriendsRepository friendRepository;

    public FriendsController(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    @GetMapping
    public List<Friend> getFriends() {
        return friendRepository.findAll();
    }

    @GetMapping("/{username}")
    public Friend getFriend(@RequestAttribute String username) {
        return friendRepository.findById(username).orElseThrow(RuntimeException::new);
    }

    @PostMapping
    public ResponseEntity createFriend(@RequestBody User user, @RequestBody Friend friend) throws URISyntaxException {
        User savedUser = userRepository.save(user);
        Friend savedFriend = friendRepository.save(friend);
        return ResponseEntity.created(new URI("/private/users/" + savedUser.getId() + "/friends/" + savedFriend.getId())).body(savedFriend);
    }

    @PutMapping("/{username}")
    public ResponseEntity updateFriend(@RequestAttribute String username, @RequestBody Friend friend) {
        Friend currentFriend = friendRepository.findById(username).orElseThrow(RuntimeException::new);
        currentFriend.setName(friend.getName());
        currentFriend.setEmail(friend.getEmail());
        currentFriend = friendRepository.save(friend);

        return ResponseEntity.ok(currentFriend);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity deleteFriend(@RequestAttribute String username) {
        friendRepository.deleteById(username);
        return ResponseEntity.ok().build();
    }
}