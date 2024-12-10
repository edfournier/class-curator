package com.group.project.entities;

import org.junit.jupiter.api.Test;

import com.group.project.types.common.UniversitySession;

import static org.assertj.core.api.Assertions.assertThat;

public class UniClassTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        Course course = new Course("CODE 123", "Course Name", "Subject", "Description");
        UniversitySession universitySession = new UniversitySession();
        String prof = "Professor Zen";

        // Act
        UniClass uniClass = new UniClass(course, universitySession, prof);

        // Assert
        assertThat(uniClass.getId()).isEqualTo(0L);
        assertThat(uniClass.getCourse()).isEqualTo(course);
        assertThat(uniClass.getSession()).isEqualTo(universitySession);
        assertThat(uniClass.getProf()).isEqualTo(prof);
    }
}
