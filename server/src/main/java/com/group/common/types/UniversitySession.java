package com.group.common.types;

import java.io.Serializable;

public class UniversitySession implements Serializable{
    public int year;
    public String semester;

    public UniversitySession(int year, String semester) {
        this.year = year;
        this.semester = semester;
    }
}
