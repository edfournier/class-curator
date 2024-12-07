package com.group.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group.project.entities.RatingUser;
import com.group.project.entities.UniClass;
import com.group.project.entities.User;
import com.group.project.types.UserRatingId;

public interface RatingUserRepository  extends JpaRepository<RatingUser, UserRatingId> {
    List<RatingUser> findByUser(User user);
    List<RatingUser> findByUniClass(UniClass uniClass);
    Optional<RatingUser> findByUser_UniClass(User user, UniClass uniClass);
}
