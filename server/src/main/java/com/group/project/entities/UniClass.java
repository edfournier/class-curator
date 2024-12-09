package com.group.project.entities;

import com.group.project.types.UniversitySession;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UniClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    @Embedded
    private UniversitySession session;

    private String prof;

    public UniClass() {
    }

    public UniClass(Course course, UniversitySession session, String prof) {
        this.course = course;
        this.session = session;
        this.prof = prof;
    }

    public long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public UniversitySession getSession() {
        return session;
    }

    public String getProf() {
        return prof;
    }
}
