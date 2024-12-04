package com.group.project.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Friendship {
    @Id
    @GeneratedValue
    private long id;

    @ManyToOne @JoinColumn(name = "user_1_id", referencedColumnName = "id")
    private User user1;

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
