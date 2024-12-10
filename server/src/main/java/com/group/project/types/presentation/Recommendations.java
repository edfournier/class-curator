package com.group.project.types.presentation;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.project.entities.Course;
import com.group.project.repositories.CourseRepository;

public class Recommendations {
    final public List<Recommendation> tags;
    final public List<PopularRecommendation> friends;
    final public List<PopularRecommendation> peers;

    @Autowired
    CourseRepository courseRepository;

    public Recommendations(String rawTagRecServerResponse, List<Map.Entry<Course, Integer>> friendsRecs,
            List<Map.Entry<Course, Integer>> peersRecs) {
        List<String> tags = List.of();
        try {
            ObjectMapper mapper = new ObjectMapper();
            TagRecommendations tagsRecs = mapper.readValue(rawTagRecServerResponse, TagRecommendations.class);
            tags = tagsRecs.recommended_courses;
        } catch (JsonProcessingException e) {
            System.out.println("Error parsing tags rec string");
        }

        this.tags = tags.stream()
                .flatMap(tag -> Stream.of(new Recommendation(courseRepository.findByCode(tag).orElse(null)))).toList();
        this.friends = friendsRecs.stream()
                .flatMap(friendsRec -> Stream.of(new PopularRecommendation(friendsRec.getKey(), friendsRec.getValue())))
                .toList();
        this.peers = peersRecs.stream()
                .flatMap(peersRec -> Stream.of(new PopularRecommendation(peersRec.getKey(), peersRec.getValue())))
                .toList();
    }

    class TagRecommendations {
        List<String> recommended_courses;

        public TagRecommendations(List<String> recommended_courses) {
            this.recommended_courses = recommended_courses;
        }
    }

    class PopularRecommendation extends Recommendation {
        public int networkCount;

        public PopularRecommendation(Course course, int networkCount) {
            super(course);
            this.networkCount = networkCount;
        }
    }

    class Recommendation {
        public Course course;

        public Recommendation(Course course) {
            this.course = course;
        }
    }
}
