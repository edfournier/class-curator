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
import java.util.Optional;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Value("${oauth.google.tokeninfo}")
    private String tokenInfoEndpoint;

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

    @Value("${domain.defaults.user.grad_session.semester}")
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
            Optional<Session> session = sessionRepository.findByToken(token);
            User user = null;

            // use cached session is valid, else create user and session
            if (session.isPresent() && (new Date()).before(session.get().getExpires_at())) {
                user = session.get().getUser();
            } else {
                user = createUserAndRefreshSession(token);
            }

            request.setAttribute("currentUser", user);
            request.setAttribute("username", user.getUsername()); // TODO: Remove this!
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
        return;
    }

    private User createUserAndRefreshSession(String token) throws IOException, ParseException, Exception {
        User user = null;
        JsonNode tokenInfo = getTokenInfo(token);
        String email = tokenInfo.get("email").asText();

        // Check if user exists in DB, else create new user
        Optional<User> userQueryResult = userRepository.findByUsername(email);
        if (userQueryResult.isPresent()) {
            user = userQueryResult.get();
        } else {
            // TODO: Can check if user is Umass student
            String displayName = tokenInfo.get("name").asText();
            int defaultGradYear = Year.now().getValue() + 4;
            user = new User(email, displayName, new UniversitySession(defaultGradYear, defaultGradSemester),
                    defaultMajor);
            user = userRepository.save(user);
        }

        // Remove any pre-existing sessions
        sessionRepository.removeByUser(user);

        Session session = new Session(token, user, new Date(new Date().getTime() + 1)); // Default token expiry is 1
                                                                                        // hour
        session = sessionRepository.save(session);

        return user;
    }

    private JsonNode getTokenInfo(String token) throws IOException, ParseException {
        String res = rest.getForObject(tokenInfoEndpoint + "?access_token=" + token, String.class);
        JsonNode tokenInfo = objectMapper.readTree(res);
        return tokenInfo;
    }
}