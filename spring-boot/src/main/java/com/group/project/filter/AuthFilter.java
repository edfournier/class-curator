package com.group.project.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.project.entities.Session;
import com.group.project.entities.User;
import com.group.project.repositories.SessionRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.types.common.UniversitySession;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.text.ParseException;
import java.time.Year;
import java.util.Date;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Value("${oauth.google.userinfo}")
    private String userInfoEndpoint;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate rest;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Value("${domain.defaults.user.major}")
    private String defaultMajor;

    @Value("${domain.defaults.user.gradSession.semester}")
    private String defaultGradSemester;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing or invalid");
            return;
        }

        try {
            String token = authHeader.substring(7); // Omit "Bearer " from header value
            Session session = sessionRepository.findByToken(token).orElse(null);
            User user = null;

            // use cached session is valid, else create user and session
            if (session != null && (new Date()).before(session.getExpires_at())) {
                user = session.getUser();
            } else {
                user = createUserAndRefreshSession(token);
            }

            request.setAttribute("currentUser", user);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
        return;
    }

    private User createUserAndRefreshSession(String token) throws IOException, ParseException, Exception {
        JsonNode userInfo = getUserInfo(token);
        String email = userInfo.get("email").asText();
        String name = userInfo.get("name").asText();

        // Check if user exists in DB, else create new user
        User user = userRepository.findByUsername(email).orElse(null);
        
        if (user == null) {
            // TODO: Can check if user is Umass student
            String displayName = name;
            int defaultGradYear = Year.now().getValue() + 4;
            user = new User(email, displayName, new UniversitySession(defaultGradYear, defaultGradSemester),
                    defaultMajor);
            user = userRepository.save(user);
        }

        // Remove any pre-existing sessions
        sessionRepository.removeByUser(user);

        // Default token expiry is 1 hour
        Session session = new Session(token, user, new Date(new Date().getTime() + 1 * 3600 * 1000));
        
        // 'Cache' session
        sessionRepository.save(session);
        return user;
    }

    private JsonNode getUserInfo(String token) throws IOException, ParseException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> res = rest.exchange(
            userInfoEndpoint, 
            HttpMethod.GET, 
            entity, 
            String.class
        );
        return objectMapper.readTree(res.getBody());
    }
}