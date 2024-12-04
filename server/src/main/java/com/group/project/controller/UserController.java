package com.group.project.controller;  

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private/users")  
public class UserController {

    private final UserRepository userRepository;

    public UsersController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{username}")
    public User getUser(@RequestAttribute String username) {
        return userRepository.findById(username).orElseThrow(RuntimeException::new);
    }

    @PostMapping
    public ResponseEntity createUser(@RequestBody User user) throws URISyntaxException {
        User savedUser = userRepository.save(user);
        return ResponseEntity.created(new URI("/private/users/" + savedUser.getId())).body(savedUser);
    }

    @PutMapping("/{username}")
    public ResponseEntity updateUser(@RequestAttribute String username, @RequestBody User user) {
        User currentUser = userRepository.findById(username).orElseThrow(RuntimeException::new);
        currentUser.setName(user.getName());
        currentUser.setEmail(user.getEmail());
        currentUser = userRepository.save(user);

        return ResponseEntity.ok(currentUser);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity deleteUser(@RequestAttribute String username) {
        userRepository.deleteById(username);
        return ResponseEntity.ok().build();
    }
}