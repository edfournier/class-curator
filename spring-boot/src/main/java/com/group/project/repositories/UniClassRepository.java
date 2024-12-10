package com.group.project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Course;
import com.group.project.entities.UniClass;
import com.group.project.types.common.UniversitySession;

import java.util.List;
import java.util.Optional;

public interface UniClassRepository extends JpaRepository<UniClass, Long> {
    Optional<UniClass> findById(long id);

    List<UniClass> findByCourse(Course course);

    List<UniClass> findBySession(UniversitySession session);

    List<UniClass> findByCourseAndSession(Course course, UniversitySession session);
}
