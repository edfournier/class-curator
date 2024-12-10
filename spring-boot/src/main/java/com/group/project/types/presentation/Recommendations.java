package com.group.project.types.presentation;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import com.group.project.entities.Course;

public class Recommendations {
    final public List<Recommendation> tags;
    final public List<NetworkRecommendation> friends;
    final public List<NetworkRecommendation> peers;

    public Recommendations(List<Course> tagRecs, List<Map.Entry<Course, Integer>> friendRecs,
            List<Map.Entry<Course, Integer>> peerRecs) {
        this.tags = packRecs(tagRecs);
        this.friends = packNetworkRecs(friendRecs);
        this.peers = packNetworkRecs(peerRecs);
    }

    List<NetworkRecommendation> packNetworkRecs(List<Map.Entry<Course, Integer>> recs) {
        return recs.stream()
        .flatMap(rec -> Stream.of(new NetworkRecommendation(rec.getKey(), rec.getValue())))
        .toList();
    }

    List<Recommendation> packRecs(List<Course> recs) {
        return recs.stream()
        .flatMap(rec -> Stream.of(new Recommendation(rec)))
        .toList();
    }

    class NetworkRecommendation extends Recommendation {
        public int networkCount;

        public NetworkRecommendation(Course course, int networkCount) {
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
