package com.group.project.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne @JoinColumn(name="course_id", referencedColumnName = "id")
    private Course course;

    public UserInterest() {
    }

    public UserInterest(User user, Course course) {
        this.user = user;
        this.course = course;
    }

    public long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Course getCourse() {
        return course;
    }
}
