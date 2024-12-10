package com.group.project.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.repositories.CourseRepository;
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

    public static List<Course> getCoursesFromTagRecommendationsResponse(CourseRepository courseRepository, String rawTagRecServerResponse) {
        ObjectMapper mapper = new ObjectMapper();
        List<String> courseCodes = List.of(); // Default empty list if error while parsing string

        try {
            // Deserialize JSON string
            TagRecommendations tagRecs = mapper.readValue(rawTagRecServerResponse, TagRecommendations.class);
            courseCodes = tagRecs.recommended_courses;
        } catch (JsonProcessingException e) {}

        return courseCodes.stream()
                .flatMap(tag -> Stream.of(courseRepository.findByCode(tag).orElse(null))).toList();
    }

    class TagRecommendations {
        List<String> recommended_courses;

        public TagRecommendations(List<String> recommended_courses) {
            this.recommended_courses = recommended_courses;
        }
    }
}
