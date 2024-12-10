package com.group.project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.User;
import com.group.project.types.common.UniversitySession;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(long id);

    Optional<User> findByUsername(String username);

    List<User> findByGradSession(UniversitySession session);
}
