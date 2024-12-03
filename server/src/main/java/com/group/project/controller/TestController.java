package com.group.project.controller;  

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private")  
public class TestController {

    // Example of using private endpoint
    @GetMapping("/hello")  
    public String hello(@RequestAttribute String username) {
        return "Hello " + username + "!";
    }
}