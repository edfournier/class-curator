package com.group.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Session;
import com.group.project.entities.User;

public interface SessionRepository  extends JpaRepository<Session, String> {
    Optional<Session> findByToken(String token);
    Optional<Session> findByUser(User user);
}
