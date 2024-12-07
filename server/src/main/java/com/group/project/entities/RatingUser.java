package com.group.project.entities;

import java.util.Date;

import com.group.project.types.UserRatingId;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@IdClass(UserRatingId.class)
public class RatingUser {
    @Id @ManyToOne @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @Id @ManyToOne @JoinColumn(name="class_id", referencedColumnName = "id")
    private Class uni_class;

    private int rating;

    private String review;

    private Date created_at;

    private Date updated_at;

    public RatingUser() {
    }

    public RatingUser(User user, Class uni_class) {
        this.user = user;
        this.uni_class = uni_class;
        rating = 0;
        review = "";
    }

    public RatingUser(User user, Class uni_class, int rating, String review, Date created_at, Date updated_at) {
        this.user = user;
        this.uni_class = uni_class;
        this.rating = rating;
        this.review = review;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public User getUser() {
        return user;
    }

    public Class getUni_class() {
        return uni_class;
    }

    public int getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }        
}
