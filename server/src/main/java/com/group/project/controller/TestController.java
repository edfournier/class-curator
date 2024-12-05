package com.group.project.controller;  

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserRepository;

@RestController
@RequestMapping("/")  
public class TestController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    FriendshipRepository friendshipRepository;

    // Example of using private endpoint
    @GetMapping("/private/hello")  
    public String hello(@RequestAttribute String username) {
        return "Hello " + username + "!";
    }

    // Example of using public endpoint
    @GetMapping("/")  
    public String defaultGreet() {
        return "Hello User! Launch the extension to see more or hit the /test API to try your luck :P";
    }

    // testing ground for DB fns
    @GetMapping("/test")
    // public List<User> testFn(@RequestParam String user_1_username, @RequestParam String user_2_username) {
    public ResponseEntity testFn(@RequestParam String user_1_username, @RequestParam String user_2_username) {
        User user1 = new User(user_1_username, "u1", 2024, "FALL", "CS");
        User user2 = new User(user_2_username, "u2", 2024, "FALL", "CS");
        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
        
        user1 = userRepository.findByUsername(user2.getUsername()).orElseThrow();
        user2 = userRepository.findByUsername(user_1_username).orElseThrow();

        // Because unidirectional graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }

        Friendship friendship = new Friendship(user1, user2);
        friendshipRepository.save(friendship);

        // Stream<User> friendsStream = Stream.concat(friendshipRepository.findByUser1(user2).stream(), friendshipRepository.findByUser2(user2).stream());

        // // TODO: Handle missing friendship
        // Friendship friendship = friendshipRepository.findByUser1AndUser2(user1, user2).orElseThrow();

        // friendshipRepository.delete(friendship);
        // return friendsStream.toList();
        return ResponseEntity.ok().build();
    }
}