package com.group.project.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "id")
    private User receiver;

    private Date created_at;

    public FriendRequest() {
    }

    public FriendRequest(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
        this.created_at = new Date();
    }

    public User getSender() {
        return sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public Date getCreated_at() {
        return created_at;
    }
}
