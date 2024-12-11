package com.group.project.filter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.client.RestTemplate;

import com.group.project.entities.Session;
import com.group.project.entities.User;
import com.group.project.repositories.SessionRepository;
import com.group.project.repositories.UserRepository;

import jakarta.servlet.ServletException;

public class AuthFilterTest {
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
        MockitoAnnotations.openMocks(this);
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

    @Test
    void sessionCacheMissInvalidRespChecks() throws ServletException, IOException {
        // Setup
        String mockToken = "token";
        String mockHeader = "Bearer " + mockToken;
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", mockHeader);

        User mockUser = new User();
        Date sessionExpiry = new Date(new Date().getTime() + 1 * 3600 * 1000);
        Mockito.when(sessionRepository.findByToken(mockToken)).thenReturn(Optional.empty());

        String mockUsername = "user1@mail.com";
        String mockDisplayName = "User One";
        String mockedResponseString = "{\"email\": \"" + mockUsername + "\",\"name\": \"" + mockDisplayName + "}";
        ResponseEntity<String> mockRes = new ResponseEntity<String>(mockedResponseString, HttpStatus.OK);

        Mockito.when(rest.exchange(
                ArgumentMatchers.anyString(),
                ArgumentMatchers.any(HttpMethod.class),
                ArgumentMatchers.any(),
                ArgumentMatchers.<Class<String>>any())
            ).thenReturn(mockRes);
        Mockito.when(userRepository.findByUsername(mockUsername)).thenReturn(Optional.of(mockUser));
        Mockito.when(sessionRepository.removeByUser(mockUser)).thenReturn(1l);
        Session mockSession = new Session(mockToken, mockUser, sessionExpiry);
        Mockito.when(sessionRepository.save(any())).thenReturn(mockSession);

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Act
        authFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(request.getAttribute("currentUser")).isEqualTo(null);
        assertThat(response.getStatus()).isEqualTo(401);
    }

    @Test
    void sessionCacheMissChecks() throws ServletException, IOException {
        // Setup
        String mockToken = "token";
        String mockHeader = "Bearer " + mockToken;
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", mockHeader);

        User mockUser = new User();
        Date sessionExpiry = new Date(new Date().getTime() + 1 * 3600 * 1000);
        Mockito.when(sessionRepository.findByToken(mockToken)).thenReturn(Optional.empty());

        String mockUsername = "user1@mail.com";
        String mockDisplayName = "User One";
        String mockedResponseString = "{\"email\": \"" + mockUsername + "\",\"name\": \"" + mockDisplayName + "\"}";
        ResponseEntity<String> mockRes = new ResponseEntity<String>(mockedResponseString, HttpStatus.OK);

        Mockito.when(rest.exchange(
                ArgumentMatchers.anyString(),
                ArgumentMatchers.any(HttpMethod.class),
                ArgumentMatchers.any(),
                ArgumentMatchers.<Class<String>>any())
            ).thenReturn(mockRes);
        Mockito.when(userRepository.findByUsername(mockUsername)).thenReturn(Optional.of(mockUser));
        Mockito.when(sessionRepository.removeByUser(mockUser)).thenReturn(1l);
        Session mockSession = new Session(mockToken, mockUser, sessionExpiry);
        Mockito.when(sessionRepository.save(any())).thenReturn(mockSession);

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        // Act
        authFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(request.getAttribute("currentUser")).isEqualTo(null);
        assertThat(response.getStatus()).isEqualTo(401);
    }
}
