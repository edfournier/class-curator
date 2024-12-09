package com.group.project.types.common;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Transient;

@Embeddable
public class UniversitySession implements Serializable {
    public int year;
    public String semester;

    @Transient
    List<String> allowedSemesterValues = Arrays.asList(new String[] {"FALL", "SPRING"});

    public UniversitySession() {
    }

    public UniversitySession(int year, String semester) throws Exception {
        this.year = year;
        validateSemester(semester);
        this.semester = semester;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setSemester(String semester) throws Exception {
        validateSemester(semester);
        this.semester = semester;
    }

    private void validateSemester(String candidateValue) throws Exception {
        if (allowedSemesterValues.indexOf(candidateValue) == -1) throw new Exception("Semester value isn't valid!");
    }
}
