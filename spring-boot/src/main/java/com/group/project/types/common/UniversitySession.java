package com.group.project.types.common;

import java.io.Serializable;

import com.group.project.utils.domain.UniversityStrings;

import jakarta.persistence.Embeddable;

@Embeddable
public class UniversitySession implements Serializable {
    public int year;
    public String semester;

    public UniversitySession() {
    }

    public UniversitySession(int year, String semester) throws Exception {
        this.year = year;
        UniversityStrings.validateSemester(semester); // reject invalid values
        this.semester = semester;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setSemester(String semester) throws Exception {
        UniversityStrings.validateSemester(semester); // reject invalid values
        this.semester = semester;
    }

}
