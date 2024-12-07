package com.group.project.entities;

import com.group.project.types.UniversitySession;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UniClass {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @ManyToOne @JoinColumn(name= "course_id", referencedColumnName = "id")
    private Course course;

    private int year;

    private String semester;

    private String prof;

    public UniClass() {}

    public UniClass(Course course, UniversitySession session, String prof) {
        this.course = course;
        this.year = session.year;
        this.semester = session.semester;
        this.prof = prof;
    }


    public long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public int getYear() {
        return year;
    }

    public String getSemester() {
        return semester;
    }

    public String getProf() {
        return prof;
    }

    public UniversitySession getSession() {
        return new UniversitySession(year, semester);
    }
}
