package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Course;
import com.group.project.entities.RatingAggr;
import com.group.project.entities.UniClass;

public interface RatingAggrRepository  extends JpaRepository<RatingAggr, UniClass> {
    Optional<RatingAggr> findByUniClass(UniClass uniClass);
    List<RatingAggr> findByCourse(Course course);
}
