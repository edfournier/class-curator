package com.group.project.types.presentation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.group.project.entities.Course;

public class RecommendationsTest {
    @Test
    void allEmptyListsCheck() {
        // Setup
        List<Course> tagRecs = List.of();
        List<Map.Entry<Course, Integer>> friendRecs = List.of();
        List<Map.Entry<Course, Integer>> peerRecs = List.of();

        // Act
        Recommendations recommendations = new Recommendations(tagRecs, friendRecs, peerRecs);

        // Assert
        assertThat(recommendations.tags).hasSize(0);
        assertThat(recommendations.friends).hasSize(0);
        assertThat(recommendations.peers).hasSize(0);
    }

    @Test
    void tagRecsCheck() {
        // Setup
        Course course1 = new Course();
        Course course2 = new Course();
        List<Course> tagRecs = List.of(course1, course2);
        List<Map.Entry<Course, Integer>> friendRecs = List.of();
        List<Map.Entry<Course, Integer>> peerRecs = List.of();

        // Act
        Recommendations recommendations = new Recommendations(tagRecs, friendRecs, peerRecs);

        // Assert
        assertThat(recommendations.tags).hasSize(2);
        assertThat(recommendations.tags.get(0).course).isEqualTo(course1);
        assertThat(recommendations.tags.get(1).course).isEqualTo(course2);
    }

    @Test
    void friendRecsCheck() {
        // Setup
        Course course1 = new Course();
        Course course2 = new Course();
        List<Course> tagRecs = List.of();
        List<Map.Entry<Course, Integer>> friendRecs = List.of(Map.entry(course1, 2), Map.entry(course2, 3));
        List<Map.Entry<Course, Integer>> peerRecs = List.of();

        // Act
        Recommendations recommendations = new Recommendations(tagRecs, friendRecs, peerRecs);

        // Assert
        assertThat(recommendations.friends).hasSize(2);
        assertThat(recommendations.friends.get(0).course).isEqualTo(course1);
        assertThat(recommendations.friends.get(0).networkCount).isEqualTo(2);
        assertThat(recommendations.friends.get(1).course).isEqualTo(course2);
        assertThat(recommendations.friends.get(1).networkCount).isEqualTo(3);
    }

    @Test
    void peerRecsCheck() {
        // Setup
        Course course1 = new Course();
        Course course2 = new Course();
        List<Course> tagRecs = List.of();
        List<Map.Entry<Course, Integer>> friendRecs = List.of();
        List<Map.Entry<Course, Integer>> peerRecs = List.of(Map.entry(course1, 2), Map.entry(course2, 3));

        // Act
        Recommendations recommendations = new Recommendations(tagRecs, friendRecs, peerRecs);

        // Assert
        assertThat(recommendations.peers).hasSize(2);
        assertThat(recommendations.peers.get(0).course).isEqualTo(course1);
        assertThat(recommendations.peers.get(0).networkCount).isEqualTo(2);
        assertThat(recommendations.peers.get(1).course).isEqualTo(course2);
        assertThat(recommendations.peers.get(1).networkCount).isEqualTo(3);
    }

}
