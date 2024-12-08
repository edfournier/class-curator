package com.group.project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.Friendship;
import com.group.project.entities.User;

import java.util.List;
import java.util.Optional;


public interface FriendshipRepository extends JpaRepository<Friendship, Long>{
    List<Friendship> findByUser1(User user1);
    List<Friendship> findByUser2(User user2);
    Optional<Friendship> findByUser1AndUser2(User user1, User user2);
}
