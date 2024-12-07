package com.group.project.types;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class UniversitySession implements Serializable{
    public int year;
    public String semester;

    
    public UniversitySession() {}

    public UniversitySession(int year, String semester) {
        this.year = year;
        this.semester = semester;
    }
}
