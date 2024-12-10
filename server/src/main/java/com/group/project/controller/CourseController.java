package com.group.project.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.AggrRating;
import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.entities.UserRating;
import com.group.project.repositories.AggrRatingRepository;
import com.group.project.repositories.CourseRepository;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.repositories.UserRatingRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.utils.PeopleUtils;
import com.group.project.utils.RecommendationUtils;
import com.group.project.utils.domain.DomainMapper;
import com.group.project.utils.domain.UniversityStrings;
import com.group.project.types.presentation.CourseInsights;
import com.group.project.types.presentation.PrivateCourseDetails;
import com.group.project.types.presentation.PublicCourseDetails;
import com.group.project.types.presentation.Recommendations;

@RestController
public class CourseController {
    @Autowired
    private final CourseRepository courseRepository;

    @Autowired
    private final UserRatingRepository userRatingRepository;

    @Autowired
    private final UserInterestRepository userInterestRepository;

    @Autowired
    private final AggrRatingRepository aggrRatingRepository;

    @Autowired
    private final FriendshipRepository friendshipRepository;

    @Autowired
    private final UserRepository userRepository;

    public CourseController(CourseRepository courseRepository, UserRatingRepository userRatingRepository,
            UserInterestRepository userInterestRepository, AggrRatingRepository aggrRatingRepository,
            FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRatingRepository = userRatingRepository;
        this.userInterestRepository = userInterestRepository;
        this.aggrRatingRepository = aggrRatingRepository;
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @RestController
    @RequestMapping("/course")
    public class PublicCourseController {
        @GetMapping
        public ResponseEntity<Object> searchCourses(@RequestParam String course_code_query) {

            course_code_query = UniversityStrings.standardizeCourseCode(course_code_query);

            // Search for records with partial course_code matches with course_code_query
            List<Course> courses = courseRepository.findByCodeContaining(course_code_query);
            return ResponseEntity.ok(courses);
        }

        @GetMapping("/{courseCodes}")
        public ResponseEntity<Object> getBulkCourseDetails(@PathVariable String courseCodes) {
            // Input is expected to be a comma separated string of course codes
            List<String> splitCourseCodes = List.of(courseCodes.split(","));
            ArrayList<PublicCourseDetails> coursesDetails = new ArrayList<PublicCourseDetails>();

            // Fetch vote counts for each course
            for (String courseCode : splitCourseCodes) {
                courseCode = UniversityStrings.standardizeCourseCode(courseCode);
                Course course = courseRepository.findByCode(courseCode).orElse(null);
                // Skip fetching details if course doesn't exist
                if (course != null) {
                    // Count upvotes and downvotes for course
                    int upvotes = userRatingRepository.countByCourseAndRatingEquals(course, DomainMapper.UPVOTE);
                    int downvotes = userRatingRepository.countByCourseAndRatingEquals(course,
                            DomainMapper.DOWNVOTE);
                    coursesDetails.add(new PublicCourseDetails(course, upvotes, downvotes));
                }
            }

            return ResponseEntity.ok(coursesDetails);
        }

        @GetMapping("/{courseCode}/insights")
        public ResponseEntity<Object> getCourseInsights(@PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Course course = courseRepository.findByCode(courseCode).orElse(null);

            // Return 404 if course not found
            if (course == null)
                return ResponseEntity.notFound().build();

            List<AggrRating> aggrRatings = aggrRatingRepository.findByCourse(course);
            CourseInsights insights = new CourseInsights(aggrRatings);

            return ResponseEntity.ok(insights);
        }
    }

    @RestController
    @RequestMapping("/private/course")
    public class PrivateCourseController {
        @GetMapping("/{courseCode}")
        public ResponseEntity<Object> getCourseDetails(@RequestAttribute User currentUser,
                @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Course course = courseRepository.findByCode(courseCode).orElse(null);

            // Return 404 if no matching course is found
            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            // Count upvotes and downvotes for course
            int upvotes = userRatingRepository.countByCourseAndRatingEquals(course, DomainMapper.UPVOTE);
            int downvotes = userRatingRepository.countByCourseAndRatingEquals(course, DomainMapper.DOWNVOTE);

            // Get currentUser's rating for course
            int user_rating_value = DomainMapper.BLANK_VOTE;
            UserRating userRating = userRatingRepository.findByUserAndCourse(currentUser, course).orElse(null);
            if (userRating != null) {
                user_rating_value = userRating.getRating();
            }

            // Get currentUser's interest in course
            boolean interested = userInterestRepository.findByUserAndCourse(currentUser, course).isPresent();

            try {
                return ResponseEntity
                        .ok(new PrivateCourseDetails(course, upvotes, downvotes, user_rating_value, interested));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }

        @PutMapping("/{courseCode}/interest")
        public ResponseEntity<Object> putUserInterest(@RequestAttribute User currentUser,
                @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Course course = courseRepository.findByCode(courseCode).orElse(null);

            // Return 404 if no matching course is found
            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            // Create interest if not already set
            if (!userInterestRepository.findByUserAndCourse(currentUser, course).isPresent()) {
                UserInterest userInterest = new UserInterest(currentUser, course);
                userInterest = userInterestRepository.save(userInterest);
            }
            return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{courseCode}/interest")
        public ResponseEntity<Object> deleteUserInterest(@RequestAttribute User currentUser,
                @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Course course = courseRepository.findByCode(courseCode).orElse(null);

            // Return 404 if no matching course is found
            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            // Delete interest if not set
            if (userInterestRepository.findByUserAndCourse(currentUser, course).isPresent()) {
                userInterestRepository.removeByUserAndCourse(currentUser, course);
            }
            return ResponseEntity.ok().build();
        }

        @PostMapping("/{courseCode}/rating")
        public ResponseEntity<Object> postCourseRating(@RequestAttribute User currentUser,
                @PathVariable String courseCode, @RequestParam int v) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Course course = courseRepository.findByCode(courseCode).orElse(null);

            // Return 404 if no matching course is found
            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            // Create record if no existing rating exists
            UserRating userRating = userRatingRepository.findByUserAndCourse(currentUser, course)
                    .orElse(new UserRating(currentUser, course));
            try {
                userRating.setRating(v);
            } catch (Exception e) {
                // Return 400 if rating value is an illegal one
                return ResponseEntity.badRequest().body(e.getMessage());
            }

            userRatingRepository.save(userRating);
            return ResponseEntity.ok().build();
        }

        @GetMapping("/recommendations")
        public ResponseEntity<Object> getRecommendation(@RequestAttribute User currentUser) {
            // Fetch recommendations based off user tags from inference server
            List<Course> tagRecs = List.of();
            try {
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8000/recommend/" + currentUser.getId()))
                    .method("GET", HttpRequest.BodyPublishers.noBody())
                    .build();

                HttpResponse<String> response = HttpClient.newHttpClient().send(request,
                        HttpResponse.BodyHandlers.ofString());

                tagRecs = RecommendationUtils.getCoursesFromTagRecommendationsResponse(courseRepository,
                        response.body());
            } catch (IOException | InterruptedException e) {}

            // Get currentUsers' friends
            List<User> friends = PeopleUtils.getAllFriends(friendshipRepository, currentUser);
            // Find frequency of courses amongst friends' interests, sort and select top 5
            Map<Course, Integer> courseInterestCounts = RecommendationUtils
                    .getCourseInterestCountsForUsers(userInterestRepository, friends);
            List<Map.Entry<Course, Integer>> friendRecs = RecommendationUtils.getSortedList(courseInterestCounts, 5);

            // Get currentUsers' peers
            List<User> peers = userRepository.findByGradSession(currentUser.getGradSession());
            // Find frequency of courses amongst peers' interests, sort and select top 5
            courseInterestCounts = RecommendationUtils.getCourseInterestCountsForUsers(userInterestRepository, peers);
            List<Map.Entry<Course, Integer>> peerRecs = RecommendationUtils.getSortedList(courseInterestCounts, 5);

            Recommendations recs = new Recommendations(tagRecs, friendRecs, peerRecs);
            return ResponseEntity.ok(recs);
        }

    }
}
