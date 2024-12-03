package com.group.project.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Value("${oauth.google.certs_endpoint}")
    private String certsEndpoint;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate rest;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing or invalid");
            return;
        }

        try {      
            // Decrypt and verify JWT
            String token = authHeader.substring(7); 
            SignedJWT jwt = SignedJWT.parse(token);
            RSAKey key = getPublicKey(jwt); 
            JWSVerifier verifier = new RSASSAVerifier(key.toRSAPublicKey());
            jwt.verify(verifier);

            // Extract claims and pass to controller
            JWTClaimsSet claims = jwt.getJWTClaimsSet();            
            request.setAttribute("username", claims.getClaim("email"));
            filterChain.doFilter(request, response);
        } 
        catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }

    private RSAKey getPublicKey(SignedJWT jwt) throws IOException, ParseException {
        // Fetch certs from auth provider
        // TODO: use caching, these keys change infrequently
        String jwks = rest.getForObject(certsEndpoint, String.class); 

        // Find the JWK with matching KID
        String target = jwt.getHeader().getKeyID();
        JsonNode keys = objectMapper.readTree(jwks).get("keys");
        for (JsonNode key : keys) {
            if (key.get("kid").asText().equals(target)) {
                return RSAKey.parse(key.toString());
            }
        }
        return null;
    }
}