package com.group.project.entities;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseTest {
    @Test
    void basicConstructorChecks() throws Exception {
        // Setup
        String code = "COMPSCI520";
        String name = "Theory and Practice of Software Engineering";
        String subject = "Computer Science";
        String description = "CS 520 introduces students to the principal activities and state-of-the-art techniques involved in developing high-quality software systems. Topics include: requirements analysis, formal specification methods, software design, software testing and debugging, program analysis, and automated software engineering.";

        String exepectedCode = "COMPSCI 520";

        // Act
        Course course = new Course(code, name, subject, description);

        // Assert
        assertThat(course.getCode()).isEqualTo(exepectedCode);
        assertThat(course.getName()).isEqualTo(name);
        assertThat(course.getSubject()).isEqualTo(subject);
        assertThat(course.getDescription()).isEqualTo(description);
    }
}
