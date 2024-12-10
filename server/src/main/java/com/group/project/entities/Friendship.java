package com.group.project.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_1_id", referencedColumnName = "id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user_2_id", referencedColumnName = "id")
    private User user2;

    public Friendship() {
    }

    public Friendship(User user1, User user2) {
        // Because friendship is an undirected graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }

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
