package com.group.project.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.repositories.UserInterestRepository;

public class RecommendationUtils {
    public static Map<Course, Integer> getCourseInterestCountsForUsers(UserInterestRepository userInterestRepository,
            List<User> users) {
        Map<Course, Integer> courseInterestCounts = new HashMap<>();
        users.forEach(user -> {
            List<UserInterest> userInterests = userInterestRepository.findByUser(user);
            userInterests.forEach(userInterest -> {
                Course course = userInterest.getCourse();
                courseInterestCounts.merge(course, 1, Integer::sum); // Increment count, create mapping if absent
            });
        });
        return courseInterestCounts;
    }

    public static <T> List<Map.Entry<T, Integer>> getSortedList(Map<T, Integer> counts, int num_records) {
        return counts.entrySet()
                .stream()
                .sorted((i1, i2) -> i2.getValue().compareTo(i1.getValue())) // descending sort
                .limit(num_records).toList();
    }
}
