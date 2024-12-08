package com.group.project.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Value("${oauth.google.tokeninfo}")
    private String tokenInfoEndpoint;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate rest;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing or invalid");
            return;
        }

        try {
            String token = authHeader.substring(7);
            JsonNode tokenInfo = getTokenInfo(token);
            String email = tokenInfo.get("email").asText();
            request.setAttribute("username", email);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }

    private JsonNode getTokenInfo(String token) throws IOException, ParseException {
        // TODO: add caching here to avoid hitting tokeninfo every time
        String res = rest.getForObject(tokenInfoEndpoint + "?access_token=" + token, String.class);
        JsonNode tokenInfo = objectMapper.readTree(res);
        return tokenInfo;
    }
}