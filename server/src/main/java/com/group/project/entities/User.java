package com.group.project.entities;

import com.group.project.types.UniversitySession;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
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

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "year", column = @Column(name = "grad_year")),
            @AttributeOverride(name = "semester", column = @Column(name = "grad_semester"))
    })
    private UniversitySession grad_session;

    private String major; // Not Null

    public User() {
    }

    public User(String username, String display_name, UniversitySession grad_session, String major) {
        this.username = username;
        this.display_name = display_name;
        this.grad_session = grad_session;
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

    public UniversitySession getGradSession() {
        return grad_session;
    }

    public void setGradSession(UniversitySession grad_session) {
        this.grad_session = grad_session;
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
