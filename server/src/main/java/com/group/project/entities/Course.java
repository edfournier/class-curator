package com.group.project.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    private String code;

    private String name;

    private String subject;

    private String description;

    public Course() {}

    public Course(String code, String name, String subject, String description) {
        this.code = code;
        this.name = name;
        this.subject = subject;
        this.description = description;
    }

    String getCode() {
        return code;
    }

    String getSubject() {
        return subject;
    }

    String getName() {
        return name;
    }
    
    String getDescription() {
        return description;
    }
}
