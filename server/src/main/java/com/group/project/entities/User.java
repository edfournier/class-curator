package com.group.project.entities;

import com.group.project.types.UniversitySession;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username; // Unique, Not Null

    private String display_name; // Not Null

    private int grad_year; // Not Null

    private String grad_semester; // Not Null

    private String major; // Not Null

    public User() {}

    public User(String username, String display_name, int grad_year, String grad_semester, String major) {
        this.username = username;
        this.display_name = display_name;
        this.grad_year = grad_year;
        this.grad_semester = grad_semester;
        this.major = major;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return display_name;
    }

    public UniversitySession getSession() {
        return new UniversitySession(grad_year, grad_semester);
    }

    public String getMajor() {
        return major;
    }

    public void setDisplayName(String displayName) {
        this.display_name = displayName;
    }

    public void setMajor(String major) {
        this.major = major;
    }
}
