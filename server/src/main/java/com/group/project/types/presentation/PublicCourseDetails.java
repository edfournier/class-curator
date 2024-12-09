package com.group.project.types.presentation;

import com.group.project.entities.Course;

public class PublicCourseDetails {
    public final Course course;
    public final int upvotes;
    public final int downvotes;

    public PublicCourseDetails(Course course, int upvotes, int downvotes) {
        this.course = course;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }

}
