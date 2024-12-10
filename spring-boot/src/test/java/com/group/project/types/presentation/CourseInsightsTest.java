package com.group.project.types.presentation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.group.project.entities.AggrRating;
import com.group.project.entities.Course;
import com.group.project.entities.UniClass;
import com.group.project.types.common.UniversitySession;

public class CourseInsightsTest {
    @Test
    void emptyRatingsCheck() {
        // Setup
        List<AggrRating> aggrRatings = List.of();

        // Act
        CourseInsights courseInsights = new CourseInsights(aggrRatings);

        // Assert
        assertThat(courseInsights.profRatings).hasSize(0);
        assertThat(courseInsights.ratingHistory).hasSize(0);
    }

    @Test
    void oneProfCheck() throws Exception {
        // Setup
        Course course = new Course();
        String prof1 = "Prof One";
        UniversitySession universitySession1 = new UniversitySession(2024, "FALL");
        UniversitySession universitySession2 = new UniversitySession(2023, "FALL");
        List<AggrRating> aggrRatings = List.of(
            new AggrRating(new UniClass(course, universitySession1, prof1), 4.0f, 4.0f),
            new AggrRating(new UniClass(course, universitySession2, prof1), 4.0f, 2.0f)
        );

        // Act
        CourseInsights courseInsights = new CourseInsights(aggrRatings);

        // Assert
        assertThat(courseInsights.profRatings).containsExactly(Map.entry(prof1, 4.75f));
        assertThat(courseInsights.ratingHistory).hasSize(2);
        assertThat(courseInsights.ratingHistory.get(1).session).isEqualTo(universitySession2);
        assertThat(courseInsights.ratingHistory.get(1).prof).isEqualTo(prof1);
        assertThat(courseInsights.ratingHistory.get(1).helpfulness).isEqualTo(4.0f);
        assertThat(courseInsights.ratingHistory.get(1).difficulty).isEqualTo(2.0f);
    }

    @Test
    void manyProfCheck() {
        // Setup
        Course course = new Course();
        String prof1 = "Prof One";
        String prof2 = "Prof Two";
        List<AggrRating> aggrRatings = List.of(
            new AggrRating(new UniClass(course, new UniversitySession(), prof1), 4.0f, 4.0f),
            new AggrRating(new UniClass(course, new UniversitySession(), prof1), 4.0f, 2.0f),
            new AggrRating(new UniClass(course, new UniversitySession(), prof2), 4.0f, 4.0f)
        );

        // Act
        CourseInsights courseInsights = new CourseInsights(aggrRatings);

        // Assert
        assertThat(courseInsights.profRatings).containsExactly(Map.entry(prof1, 4.75f), Map.entry(prof2, 2.5f));
        assertThat(courseInsights.ratingHistory).hasSize(3);
    }
}
