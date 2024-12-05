package com.group.project.entities;

import com.group.common.types.FriendshipId;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity @IdClass(FriendshipId.class)
public class Friendship {
    @Id
    @ManyToOne @JoinColumn(name = "user_1_id", referencedColumnName = "id")
    private User user1;

    @Id
    @ManyToOne @JoinColumn(name = "user_2_id", referencedColumnName = "id")
    private User user2;

    public Friendship(User user1, User user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    public User getUser1() {
        return user1;
    }

    public User getUser2() {
        return user2;
    }
}
