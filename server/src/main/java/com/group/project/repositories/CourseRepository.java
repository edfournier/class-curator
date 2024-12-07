package com.group.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Course;

public interface CourseRepository  extends JpaRepository<Course, Long> {
    Optional<Course> findById(long id);
}