package com.group.project.types.presentation;

import com.group.project.entities.Course;

public class PrivateCourseDetails extends PublicCourseDetails {
    public final int userRating;
    public final boolean interested;

    public PrivateCourseDetails(Course course, int upvotes, int downvotes, int userRating, boolean interested) {
        super(course, upvotes, downvotes);
        this.userRating = userRating;
        this.interested = interested;
    }

}
