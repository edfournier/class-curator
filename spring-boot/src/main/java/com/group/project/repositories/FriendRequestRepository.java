package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.FriendRequest;
import com.group.project.entities.User;

import jakarta.transaction.Transactional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findBySender(User sender);

    List<FriendRequest> findByReceiver(User receiver);

    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    @Transactional
    Long removeBySenderAndReceiver(User sender, User receiver);
}
