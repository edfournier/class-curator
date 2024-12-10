package com.group.project.entities;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class UserInterestTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        User user = new User();
        Course course = new Course();

        // Act
        UserInterest userInterest = new UserInterest(user, course);

        // Assert
        assertThat(userInterest.getId()).isEqualTo(0L);
        assertThat(userInterest.getUser()).isEqualTo(user);
        assertThat(userInterest.getCourse()).isEqualTo(course);
    }
}
