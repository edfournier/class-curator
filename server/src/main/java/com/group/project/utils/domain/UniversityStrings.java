package com.group.project.utils.domain;

import java.util.Arrays;
import java.util.List;

public interface UniversityStrings {

    public static String standardizeCourseCode(String candidate) {
        // Standardizing course_code_query to match "ABC 123X" format
        candidate = candidate.replace(" ", "");
        candidate = candidate.toUpperCase();
        int idx = 0;
        for (idx = 0; idx < candidate.length(); idx++) {
            if (Character.isDigit(candidate.charAt(idx)))
                break;
        }

        if (idx != candidate.length())
            candidate = candidate.substring(0, idx) + " " + candidate.substring(idx);
        return candidate;
    }

    static List<String> allowedSemesterValues = Arrays.asList(new String[] { "FALL", "SPRING" });

    public static void validateSemester(String candidate) throws Exception {
        if (allowedSemesterValues.indexOf(candidate) == -1)
            throw new Exception("Semester value isn't valid!");
    }
}
