package com.group.project.entities;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.group.project.types.common.UniversitySession;

public class AggrRatingTest {
    @Test
    void basicConstructorChecks() throws Exception {
        // Setup
        Course course = new Course();
        UniClass uniClass = new UniClass(course, new UniversitySession(2025, "FALL"), "Prof");

        float expected_default_rating = -1.0f;

        // Act
        AggrRating aggrRating = new AggrRating(uniClass);

        // Assert
        assertThat(aggrRating.getUniClass()).isEqualTo(uniClass);
        assertThat(aggrRating.getCourse()).isEqualTo(course);
        assertThat(aggrRating.getRate_rmp_difficulty()).isEqualTo(expected_default_rating);
        assertThat(aggrRating.getRate_rmp_helpfulness()).isEqualTo(expected_default_rating);
    }

    @Test
    void blankConstructorChecks() throws Exception {
        // Act
        AggrRating aggrRating = new AggrRating();

        // Assert
        assertThat(aggrRating.getUniClass()).isEqualTo(null);
        assertThat(aggrRating.getCourse()).isEqualTo(null);
        assertThat(aggrRating.getRate_rmp_helpfulness()).isEqualTo(0f);
        assertThat(aggrRating.getRate_rmp_difficulty()).isEqualTo(0f);
    }

    @Test
    void ratingConstructorChecks() throws Exception {
        // Setup
        Course course = new Course();
        UniClass uniClass = new UniClass(course, new UniversitySession(2025, "FALL"), "Prof");
        float rate_rmp_difficulty = 5.0f;
        float rate_rmp_helpfulness = 3.0f;

        // Act
        AggrRating aggrRating = new AggrRating(uniClass, rate_rmp_helpfulness, rate_rmp_difficulty);

        // Assert
        assertThat(aggrRating.getUniClass()).isEqualTo(uniClass);
        assertThat(aggrRating.getCourse()).isEqualTo(course);
        assertThat(aggrRating.getRate_rmp_helpfulness()).isEqualTo(rate_rmp_helpfulness);
        assertThat(aggrRating.getRate_rmp_difficulty()).isEqualTo(rate_rmp_difficulty);
    }
}
