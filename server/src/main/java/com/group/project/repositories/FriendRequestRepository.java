package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.FriendRequest;
import com.group.project.entities.User;

public interface FriendRequestRepository  extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByUser1(User user1);
    List<FriendRequest> findByUser2(User user2);
    Optional<FriendRequest> findByUser1AndUser2(User user1, User user2);
}
