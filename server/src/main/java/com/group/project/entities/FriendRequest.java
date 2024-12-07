package com.group.project.entities;

import java.util.Date;

import com.group.project.types.FriendshipId;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity @IdClass(FriendshipId.class)
public class FriendRequest {
    @Id
    @ManyToOne @JoinColumn(name = "user_1_id", referencedColumnName = "id")
    private User user1;

    @Id
    @ManyToOne @JoinColumn(name = "user_2_id", referencedColumnName = "id")
    private User user2;

    private Date created_at;

    public FriendRequest(User user1, User user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    public User getUser1() {
        return user1;
    }

    public User getUser2() {
        return user2;
    }

    public Date getCreated_at() {
        return created_at;
    }
}
