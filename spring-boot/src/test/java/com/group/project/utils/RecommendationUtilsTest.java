package com.group.project.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.repositories.CourseRepository;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.utils.RecommendationUtils.TagRecommendations;

public class RecommendationUtilsTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserInterestRepository userInterestRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void courseInterestCountsChecks() {
        // Setup
        User user1 = new User();
        User user2 = new User();
        Course course1 = new Course();
        Course course2 = new Course();

        List<UserInterest> user1Interests = List.of(
                new UserInterest(user1, course1),
                new UserInterest(user1, course2));
        List<UserInterest> user2Interests = List.of(
                new UserInterest(user2, course1));

        List<User> users = List.of(user1, user2);

        when(userInterestRepository.findByUser(user1)).thenReturn(user1Interests);
        when(userInterestRepository.findByUser(user2)).thenReturn(user2Interests);

        Map<Course, Integer> expectedCounts = new HashMap<>();
        expectedCounts.put(course1, 2);
        expectedCounts.put(course2, 1);

        // Act (and Assert)
        assertThat(RecommendationUtils.getCourseInterestCountsForUsers(userInterestRepository, users))
                .containsExactlyInAnyOrderEntriesOf(expectedCounts);
    }

    @Test
    void sortedListChecks() {
        // Setup
        Map<String, Integer> map = new HashMap<>();
        map.put("One", 1);
        map.put("Three", 3);
        map.put("Two", 2);

        // Act (and Assert)
        assertThat(RecommendationUtils.getSortedList(map, 3))
                .containsExactly(
                        Map.entry("Three", 3),
                        Map.entry("Two", 2),
                        Map.entry("One", 1));
    }

    @Test
    void emptyTagRecsParserChecks() {
        // Setup
        String rawTagRecServerResponseString = "{\"recommended_courses\":[]}";

        // Act
        List<Course> courses = RecommendationUtils.getCoursesFromTagRecommendationsResponse(courseRepository,
                rawTagRecServerResponseString);

        // Assert
        assertThat(courses).hasSize(0);
    }

    @Test
    void emptyTagRecsParserWithBadStringChecks() {
        // Setup
        String rawTagRecServerResponseString = "{\"recommended_courses\":[}";

        // Act
        List<Course> courses = RecommendationUtils.getCoursesFromTagRecommendationsResponse(courseRepository,
                rawTagRecServerResponseString);

        // Assert
        assertThat(courses).hasSize(0);
    }

    @Test
    void tagRecsParserChecks() {
        // Setup
        String rawTagRecServerResponseString = "{\"recommended_courses\":[\"fromTag1\"]}";
        Course course1 = new Course();
        String code1 = "fromTag1";
        when(courseRepository.findByCode(code1)).thenReturn(Optional.of(course1));

        // Act
        List<Course> courses = RecommendationUtils.getCoursesFromTagRecommendationsResponse(courseRepository,
                rawTagRecServerResponseString);

        // Assert
        assertThat(courses).contains(course1);
    }

    @Test
    void tagRecommendationsCheck() {
        // Setup
        List<String> courseCodes = List.of("code1", "code2");

        // Act
        TagRecommendations tagRecs = new RecommendationUtils.TagRecommendations(courseCodes);

        // Assert
        assertThat(tagRecs.recommended_courses).containsAll(courseCodes);
        assertThat(tagRecs.getRecommended_courses()).containsAll(courseCodes);
    }
}
