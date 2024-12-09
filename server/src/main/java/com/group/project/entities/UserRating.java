package com.group.project.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserRating {
    @Id
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "uni_class_id", referencedColumnName = "id")
    private UniClass uniClass;

    private int rating;

    private Date created_at;

    private Date updated_at;

    public UserRating() {
    }

    public UserRating(User user, UniClass uniClass) {
        this.user = user;
        this.uniClass = uniClass;
        rating = 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public UserRating(User user, UniClass uniClass, int rating) {
        this.user = user;
        this.uniClass = uniClass;
        this.rating = rating;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public UserRating(User user, UniClass uniClass, int rating, String review) {
        this.user = user;
        this.uniClass = uniClass;
        this.rating = rating;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public UserRating(User user, UniClass uniClass, int rating, Date created_at, Date updated_at) {
        this.user = user;
        this.uniClass = uniClass;
        this.rating = rating;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public User getUser() {
        return user;
    }

    public UniClass getUniClass() {
        return uniClass;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
        this.setUpdated_atToNow();
    }

    public Date getCreated_at() {
        return created_at;
    }
    
    public Date getUpdated_at() {
        return updated_at;
    }
    
    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    public void setUpdated_atToNow() {
        this.setUpdated_at(new Date());
    }
}
