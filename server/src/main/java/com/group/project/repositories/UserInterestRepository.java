package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;

import jakarta.transaction.Transactional;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long>{
    List<UserInterest> findByUser(User user);

    List<UserInterest> findByCourse(Course course);

    Optional<UserInterest> findByUserAndCourse(User user, Course course);

    @Transactional
    int deleteByUserAndCourse(User user, Course course);
}
