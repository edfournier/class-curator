package com.group.project.types.presentation;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.group.project.entities.AggrRating;
import com.group.project.types.common.UniversitySession;
import com.group.project.utils.domain.DomainMapper;

public class CourseInsights {
    final public Map<String, Float> profRatings;
    final public List<CourseInsight> ratingHistory;

    public CourseInsights(List<AggrRating> aggrRatings) {
        ratingHistory = aggrRatings.stream().flatMap(aggrRating -> Stream.of(new CourseInsight(aggrRating))).toList();
        profRatings = new ProfRatings(aggrRatings).sortedRatings;
    }

    class CourseInsight {
        final public float helpfulness;
        final public float difficulty;
        final public UniversitySession session;
        final public String prof;

        public CourseInsight(AggrRating aggrRating) {
            this.helpfulness = aggrRating.getRate_rmp_helpfulness();
            this.difficulty = aggrRating.getRate_rmp_difficulty();
            this.session = aggrRating.getUniClass().getSession();
            this.prof = aggrRating.getUniClass().getProf();
        }
    }

    class ProfRatings {
        public final Map<String, Float> sortedRatings;

        public ProfRatings(List<AggrRating> aggrRatings) {
            Map<String, Float> profRatings = new HashMap<>();

            // For each unique professor, prepare an aggregate rating
            aggrRatings.forEach(aggrRating -> {
                String prof = aggrRating.getUniClass().getProf();
                float difficulty = aggrRating.getRate_rmp_difficulty();
                float helpfulness = aggrRating.getRate_rmp_helpfulness();

                // Take average of both scores
                float weightedScore = ((DomainMapper.MAX_RMP_DIFFICULTY - difficulty) + helpfulness) / 2;

                if (profRatings.get(prof) == null) {
                    profRatings.put(prof, weightedScore);
                } else {
                    // Damped aggregate score
                    profRatings.put(prof, profRatings.get(prof) / 0.5f + weightedScore);
                }
            });

            // Sort professors by scores
            sortedRatings = profRatings.entrySet()
                    .stream()
                    .sorted((i1, i2) -> i2.getValue().compareTo(i1.getValue()))
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (e1, e2) -> e1, LinkedHashMap::new));
        }
    }
}
