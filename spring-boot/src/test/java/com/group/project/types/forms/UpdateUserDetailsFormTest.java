package com.group.project.types.forms;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.jupiter.api.Test;

public class UpdateUserDetailsFormTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        Optional<String> major = Optional.of("Major");
        Optional<String> minor = Optional.of("Minor");
        Optional<String> tags = Optional.of("");
        Optional<Integer> gradYear = Optional.of(2024);
        Optional<String> gradSemester = Optional.of("FALL");

        // Act
        UpdateUserDetailsForm updateUserDetailsForm = new UpdateUserDetailsForm(major, minor, tags, gradYear,
                gradSemester);

        // Assert
        assertThat(updateUserDetailsForm.major.get()).isEqualTo(major.get());
        assertThat(updateUserDetailsForm.minor.get()).isEqualTo(minor.get());
        assertThat(updateUserDetailsForm.tags.get()).isEqualTo(tags.get());
        assertThat(updateUserDetailsForm.gradYear.get()).isEqualTo(gradYear.get());
        assertThat(updateUserDetailsForm.gradSemester.get()).isEqualTo(gradSemester.get());
    }
}
