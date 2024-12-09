package com.group.project.entities;

import com.group.project.utils.domain.DomainMapper;

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
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    private int rating;

    public UserRating() {
    }

    public UserRating(User user, Course course) {
        this.user = user;
        this.course = course;
        rating = DomainMapper.BLANK_VOTE;
    }

    public UserRating(User user, Course course, int rating) throws Exception {
        this.user = user;
        this.course = course;
        DomainMapper.validateRating(rating);
        this.rating = rating;
    }

    public User getUser() {
        return user;
    }

    public Course getCourse() {
        return course;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) throws Exception {
        DomainMapper.validateRating(rating);
        this.rating = rating;
    }
}
