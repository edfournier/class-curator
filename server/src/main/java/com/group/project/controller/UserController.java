package com.group.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.User;
import com.group.project.repositories.UserRepository;

@RestController
@RequestMapping("/private/users")
public class UserController {

    @Autowired
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{username}")
    public User getUser(@RequestAttribute String username) {
        return userRepository.findByUsername(username).get();
    }

    @PutMapping("/{username}")
    public ResponseEntity<Object> updateUser(@RequestBody User user, @RequestAttribute String username) {
        // TODO: Check if authenticated user
        // TODO: Handle missing user
        User currentUser = userRepository.findByUsername(username).orElseThrow(RuntimeException::new);
        currentUser.setDisplayName(user.getDisplayName());
        currentUser.setMajor(user.getMajor());
        currentUser = userRepository.save(user);

        return ResponseEntity.ok(currentUser);
    }
}