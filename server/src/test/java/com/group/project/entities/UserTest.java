package com.group.project.entities;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

import com.group.project.types.common.UniversitySession;

public class UserTest {
    @Test
    void basicConstructorChecks() throws Exception {
        // Setup
        String username = "tester@mail.com";
        String displayName = "tester";
        UniversitySession session = new UniversitySession(2024, "FALL");
        String major = "Major";

        String expectedMinor = "";
        String expectedTags = "";

        // Act
        User user = new User(username, displayName, session, major);

        // Assert
        assertThat(user.getId()).isEqualTo(0L);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getDisplayName()).isEqualTo(displayName);
        assertThat(user.getGradSession()).isEqualTo(session);
        assertThat(user.getMajor()).isEqualTo(major);
        assertThat(user.getMinor()).isEqualTo(expectedMinor);
        assertThat(user.getTags()).isEqualTo(expectedTags);
    }

    @Test
    void basicSetterChecks() throws Exception {
        // Setup
        String username = "tester@mail.com";
        String displayName = "tester";
        UniversitySession session = new UniversitySession(2024, "FALL");
        String major = "Major 1";

        String newDisplayName = "Tester One";
        UniversitySession newGradSession = new UniversitySession(2024, "SPRING");
        String newMajor = "Major 2";
        String newMinor = "Minor 2";
        String newTags = "tag 1,tag 2";
        long newId = 0;

        // Act
        User user = new User(username, displayName, session, major);
        user.setDisplayName(newDisplayName);
        user.setGradSession(newGradSession);
        user.setMajor(newMajor);
        user.setMinor(newMinor);
        user.setTags(newTags);
        user._setId(newId);

        // Assert
        assertThat(user.getDisplayName()).isEqualTo(newDisplayName);
        assertThat(user.getGradSession()).isEqualTo(newGradSession);
        assertThat(user.getMajor()).isEqualTo(newMajor);
        assertThat(user.getMinor()).isEqualTo(newMinor);
        assertThat(user.getTags()).isEqualTo(newTags);
        assertThat(user.getId()).isEqualTo(newId);
    }
}
