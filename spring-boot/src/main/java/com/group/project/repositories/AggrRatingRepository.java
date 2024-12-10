package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Course;
import com.group.project.entities.AggrRating;
import com.group.project.entities.UniClass;

public interface AggrRatingRepository extends JpaRepository<AggrRating, Long> {
    Optional<AggrRating> findByUniClass(UniClass uniClass);

    List<AggrRating> findByCourse(Course course);
}
