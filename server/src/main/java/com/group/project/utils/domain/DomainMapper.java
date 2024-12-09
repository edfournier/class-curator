package com.group.project.utils.domain;

import java.util.List;

public class DomainMapper {
    static public int UPVOTE = 1;
    static public int DOWNVOTE = -1;
    static public int BLANK_VOTE = 0;
    static List<Integer> allowedRatingValues = List.of(DOWNVOTE, BLANK_VOTE, UPVOTE);

    public static void validateRating(int candidate) throws Exception {
        if (!allowedRatingValues.contains(candidate)) throw new Exception("Invalid Rating Value!");
    }
}
