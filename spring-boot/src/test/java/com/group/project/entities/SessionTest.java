package com.group.project.entities;

import org.junit.jupiter.api.Test;

import com.group.project.types.common.UniversitySession;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Date;

public class SessionTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        String token = "token";
        User user = new User("tester@mail.com", "tester", new UniversitySession(), "major");
        Date expires_at = new Date();

        // Act
        Session session = new Session(token, user, expires_at);

        // Assert
        assertThat(session.getToken()).isEqualTo(token);
        assertThat(session.getUser()).isEqualTo(user);
        assertThat(session.getExpires_at()).isEqualTo(expires_at);
    }

    @Test
    void blankConstructorChecks() {
        // Act
        Session session = new Session();

        // Assert
        assertThat(session.getToken()).isEqualTo(null);
    }
}
