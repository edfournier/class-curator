package com.group.project.entities;

import com.group.project.types.common.UniversitySession;

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
    private UniversitySession gradSession;

    private String major; // Not Null
    private String minor;
    private String tags;

    public User() {
    }

    public User(String username, String display_name, UniversitySession gradSession, String major) {
        this.username = username;
        this.display_name = display_name;
        this.gradSession = gradSession;
        this.major = major;
        this.minor = "";
        this.tags = "";
    }

    public Long getId() {
        return id;
    }

    public void _setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return display_name;
    }

    public void setDisplayName(String displayName) {
        this.display_name = displayName;
    }

    public UniversitySession getGradSession() {
        return gradSession;
    }

    public void setGradSession(UniversitySession gradSession) {
        this.gradSession = gradSession;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getMinor() {
        return minor;
    }

    public void setMinor(String minor) {
        this.minor = minor;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
}
