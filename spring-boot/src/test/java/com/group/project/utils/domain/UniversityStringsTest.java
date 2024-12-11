package com.group.project.utils.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class UniversityStringsTest {
    @Test
    void courseCodesWithoutSpaceCheck() {
        // Setup
        String courseCodeString = "abc";
        String expectedCourseCodeString = "ABC";

        // Act (and Assert)
        assertThat(UniversityStrings.standardizeCourseCode(courseCodeString)).isEqualTo(expectedCourseCodeString);
    }
}
