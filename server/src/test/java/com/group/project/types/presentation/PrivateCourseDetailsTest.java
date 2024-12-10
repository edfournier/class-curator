package com.group.project.types.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatException;

import org.junit.jupiter.api.Test;

import com.group.project.entities.Course;
import com.group.project.utils.domain.DomainMapper;

public class PrivateCourseDetailsTest {
    @Test
    void basicConstructorChecks() throws Exception {
        // Setup
        Course course = new Course();
        int upvotes = 1;
        int downvotes = 3;
        int userRating = DomainMapper.BLANK_VOTE;
        boolean interested = false;

        // Act
        PrivateCourseDetails privateCourseDetails = new PrivateCourseDetails(course, upvotes, downvotes, userRating, interested);

        // Assert
        assertThat(privateCourseDetails.course).isEqualTo(course);
        assertThat(privateCourseDetails.upvotes).isEqualTo(upvotes);
        assertThat(privateCourseDetails.downvotes).isEqualTo(downvotes);
        assertThat(privateCourseDetails.userRating).isEqualTo(userRating);
        assertThat(privateCourseDetails.interested).isEqualTo(interested);
    }

    @Test
    void invalidRatingChecks() throws Exception {
        // Setup
        Course course = new Course();
        int upvotes = 1;
        int downvotes = 3;
        int userRating = 7;
        boolean interested = false;

        // Act (and Assert)
        assertThatException().isThrownBy(() -> new PrivateCourseDetails(course, upvotes, downvotes, userRating, interested)).withMessage("Invalid Rating Value!");
    }
}
