package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.FriendRequest;
import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.types.FriendshipId;

public interface FriendRequestRepository  extends JpaRepository<FriendRequest, FriendshipId> {
    List<User> findByUser1(User user1);
    List<User> findByUser2(User user2);
    Optional<Friendship> findByUser1AndUser2(User user1, User user2);
}
