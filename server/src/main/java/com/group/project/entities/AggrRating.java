package com.group.project.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AggrRating {
    @Id
    private long id;

    @ManyToOne
    @JoinColumn(name = "uni_class_id")
    private UniClass uniClass;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    private float rate_rmp_helpfulness;

    private float rate_rmp_difficulty;

    public AggrRating() {
    }

    public AggrRating(UniClass uniClass) {
        this.uniClass = uniClass;
        this.course = uniClass.getCourse();
        this.rate_rmp_helpfulness = -1.0f;
        this.rate_rmp_difficulty = -1.0f;
    }

    public AggrRating(UniClass uniClass, float rate_user_avg, float rate_rmp_helpfulness,
            float rate_rmp_difficulty) {
        this.uniClass = uniClass;
        this.course = uniClass.getCourse();
        this.rate_rmp_helpfulness = rate_rmp_helpfulness;
        this.rate_rmp_difficulty = rate_rmp_difficulty;
    }

    public Course getCourse() {
        return course;
    }

    public UniClass getUniClass() {
        return uniClass;
    }

    public float getRate_rmp_helpfulness() {
        return rate_rmp_helpfulness;
    }

    public float getRate_rmp_difficulty() {
        return rate_rmp_difficulty;
    }
}
