package com.group.project.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Session {
    @Id
    private String token;

    @OneToOne @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Date expires_at;

    public Session() {
    }

    public Session(String token, User user, Date expires_at) {
        this.token = token;
        this.user = user;
        this.expires_at = expires_at;
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }

    public Date getExpires_at() {
        return expires_at;
    }
}
