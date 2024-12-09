package com.group.project.types.presentation;

import com.group.project.entities.Course;

public class PrivateCourseDetails extends PublicCourseDetails {
    public final int userRating;

    public PrivateCourseDetails(Course course, int upvotes, int downvotes, int userRating) {
        super(course, upvotes, downvotes);
        this.userRating = userRating;
    }

}
