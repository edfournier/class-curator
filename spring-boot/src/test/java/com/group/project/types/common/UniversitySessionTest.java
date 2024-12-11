package com.group.project.types.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatException;

import org.junit.jupiter.api.Test;

public class UniversitySessionTest {
    @Test
    void setterChecks() throws Exception {
        // Setup
        int year = 2024;
        String semester = "FALL";

        // Act
        UniversitySession universitySession = new UniversitySession();
        universitySession.setYear(year);
        universitySession.setSemester(semester);

        // Assert
        assertThat(universitySession.year).isEqualTo(year);
        assertThat(universitySession.semester).isEqualTo(semester);
    }

    @Test
    void invalidSemesterChecks() throws Exception {
        // Setup
        String semester = "NOT FALL";
        UniversitySession universitySession = new UniversitySession();

        // Act (and Assert)
        assertThatException().isThrownBy(() -> universitySession.setSemester(semester))
                .withMessage("Semester value isn't valid!");
    }
}
