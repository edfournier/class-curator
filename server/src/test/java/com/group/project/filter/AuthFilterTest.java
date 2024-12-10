package com.group.project.filter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.group.project.entities.Session;
import com.group.project.entities.User;
import com.group.project.repositories.SessionRepository;
import com.group.project.repositories.UserRepository;

import jakarta.servlet.ServletException;

public class AuthFilterTest {
    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private RestTemplate rest;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthFilter authFilter;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void cachedSessionChecks() throws ServletException, IOException {
        // Setup
        String mockToken = "token";
        String mockHeader = "Bearer " + mockToken;
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", mockHeader);

        User mockUser = new User();
        Date sessionExpiry = new Date(new Date().getTime() + 1 * 3600 * 1000);
        Session session = new Session(mockToken, mockUser, sessionExpiry);

        Mockito.when(sessionRepository.findByToken(mockToken)).thenReturn(Optional.of(session));

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Act
        authFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(request.getAttribute("currentUser")).isEqualTo(mockUser);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    void missingHeaderChecks() throws ServletException, IOException {
        // Setup
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Act
        authFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(response.getStatus()).isEqualTo(401);
    }

    @Test
    void invalidHeaderChecks() throws ServletException, IOException {
        // Setup
        String mockToken = "token";
        String mockHeader = "" + mockToken;
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", mockHeader);

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Act
        authFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(response.getStatus()).isEqualTo(401);
    }

    // @Test
    // void sessionCacheMissChecks() throws ServletException, IOException {
    //     // Setup
    //     String mockToken = "token";
    //     String mockHeader = "Bearer " + mockToken;
    //     MockHttpServletRequest request = new MockHttpServletRequest();
    //     request.addHeader("Authorization", mockHeader);

    //     User mockUser = new User();
    //     Date sessionExpiry = new Date(new Date().getTime() + 1 * 3600 * 1000);
    //     Mockito.when(sessionRepository.findByToken(mockToken)).thenReturn(Optional.empty());

    //     ObjectMapper obMapper = new ObjectMapper();
    //     String mockUsername = "user1@mail.com"; 
       
    //     Map<String, String> map = new HashMap<>();
    //     map.put("email", mockUsername);
    //     JsonNode mockTokenInfo = obMapper.valueToTree(map);
    //     String mockTokenResponse = obMapper.writeValueAsString(mockTokenInfo);

    //     Mockito.when(rest.getForObject(any(), any())).thenReturn(mockTokenResponse);
    //     Mockito.when(objectMapper.readTree(anyString())).thenReturn(mockTokenInfo);
    //     Mockito.when(userRepository.findByUsername(mockUsername)).thenReturn(Optional.of(mockUser));
    //     Mockito.when(sessionRepository.removeByUser(mockUser)).thenReturn(1l);
    //     Session mockSession = new Session(mockToken, mockUser, sessionExpiry);
    //     Mockito.when(sessionRepository.save(any())).thenReturn(mockSession);

    //     MockHttpServletResponse response = new MockHttpServletResponse();
    //     MockFilterChain filterChain = new MockFilterChain();

    //     // Act
    //     authFilter.doFilterInternal(request, response, filterChain);

    //     // Assert
    //     assertThat(request.getAttribute("test")).isEqualTo(mockTokenInfo);
    //     assertThat(request.getAttribute("currentUser")).isEqualTo(mockUser);
    //     assertThat(response.getStatus()).isEqualTo(200);
    // }

    // @Test
    // void e() throws ServletException, IOException {
    //     // Setup
    //     String mockToken = "token";
    //     String mockHeader = "Bearer " + mockToken;
    //     MockHttpServletRequest request = new MockHttpServletRequest();
    //     request.addHeader("Authorization", mockHeader);

    //     User mockUser = new User();
    //     Date sessionExpiry = new Date(new Date().getTime() + 1 * 3600 * 1000);
    //     Session session = new Session(mockToken, mockUser, sessionExpiry);

    //     Mockito.when(sessionRepository.findByToken(mockToken)).thenReturn(Optional.of(session));

    //     // String mockTokenResponse = "text";
    //     // ObjectNode mockTokenInfo = objectMapper.createObjectNode();
    //     // String mockEmail = "user1@mail.com";
    //     // mockTokenInfo.put("email", mockEmail);

    //     // Mockito.when(rest.getForObject(any(),
    //     // String.class)).thenReturn(mockTokenResponse);
    //     // Mockito.when(objectMapper.readTree(mockTokenResponse)).thenReturn(mockTokenInfo);

    //     MockHttpServletResponse response = new MockHttpServletResponse();
    //     MockFilterChain filterChain = new MockFilterChain();

    //     // Act
    //     authFilter.doFilterInternal(request, response, filterChain);

    //     // Assert
    //     assertThat(request.getAttribute("currentUser")).isEqualTo(mockUser);
    //     assertThat(response.getStatus()).isEqualTo(200);
    // }
}
