package com.group.project.entities;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatException;

import org.junit.jupiter.api.Test;

import com.group.project.utils.domain.DomainMapper;

public class UserRatingTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        User user = new User();
        Course course = new Course();

        // Act
        UserRating userRating = new UserRating(user, course);

        // Assert
        assertThat(userRating.getUser()).isEqualTo(user);
        assertThat(userRating.getCourse()).isEqualTo(course);
        assertThat(userRating.getRating()).isEqualTo(DomainMapper.BLANK_VOTE);
    }

    @Test
    void ratingConstructorCheck() throws Exception {
        // Setup
        User user = new User();
        Course course = new Course();
        int rating = DomainMapper.UPVOTE;

        // Act
        UserRating userRating = new UserRating(user, course, rating);

        // Assert
        assertThat(userRating.getUser()).isEqualTo(user);
        assertThat(userRating.getCourse()).isEqualTo(course);
        assertThat(userRating.getRating()).isEqualTo(DomainMapper.UPVOTE);
    }

    @Test
    void invalidRatingConstructorChecks() throws Exception {
        // Setup
        User user = new User();
        Course course = new Course();
        int rating = 7;

        // Act (and Assert)
        assertThatException().isThrownBy(() -> new UserRating(user, course, rating))
                .withMessage("Invalid Rating Value!");
    }

    @Test
    void setRatingChecks() throws Exception {
        // Setup
        UserRating userRating = new UserRating();
        int rating = DomainMapper.UPVOTE;

        // Act
        userRating.setRating(rating);

        // Assert
        assertThat(userRating.getRating()).isEqualTo(DomainMapper.UPVOTE);
    }

    void setInvalidRatingChecks() throws Exception {
        // Setup
        UserRating userRating = new UserRating();
        int rating = 7;

        // Act (and Assert)
        assertThatException().isThrownBy(() -> userRating.setRating(rating)).withMessage("Invalid Rating Value!");
    }
}
