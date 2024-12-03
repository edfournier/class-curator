package com.group.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${oauth.google.client_id}")
    private String clientID;

    @Value("${oauth.google.client_secret}")
    private String clientSecret;

    @Value("${oauth.google.redirect_uri}")
    private String redirectURI;

    @Value("${oauth.google.token_endpoint}")
    private String tokenEndpoint;

    @Autowired
    private RestTemplate rest;

    /**
     * Retrieves tokens from Google's token endpoint
     * @param code - the authorization code 
     * @return a JSON object containing the access, refresh, and ID tokens
     */
    @PostMapping("/google")
    public ResponseEntity<String> exchangeGoogleAuthCode(@RequestParam String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>(); 
        body.add("code", code); 
        body.add("client_id", clientID);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectURI);
        body.add("grant_type", "authorization_code");
        body.add("access_type", "offline");

        return rest.exchange(
            tokenEndpoint,
            HttpMethod.POST,
            new HttpEntity<>(body, headers),
            String.class
        );
    }
}