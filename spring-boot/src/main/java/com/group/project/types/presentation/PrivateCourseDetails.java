package com.group.project.types.presentation;

import com.group.project.entities.Course;
import com.group.project.utils.domain.DomainMapper;

public class PrivateCourseDetails extends PublicCourseDetails {
    public final int userRating;
    public final boolean interested;

    public PrivateCourseDetails(Course course, int upvotes, int downvotes, int userRating, boolean interested) throws Exception {
        super(course, upvotes, downvotes);
        DomainMapper.validateRating(userRating);
        this.userRating = userRating;
        this.interested = interested;
    }

}
