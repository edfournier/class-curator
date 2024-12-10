package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.UserRating;
import com.group.project.entities.Course;
import com.group.project.entities.User;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    List<UserRating> findByUser(User user);

    List<UserRating> findByCourse(Course course);

    Optional<UserRating> findByUserAndCourse(User user, Course course);

    int countByCourseAndRatingEquals(Course course, int rating);

}
