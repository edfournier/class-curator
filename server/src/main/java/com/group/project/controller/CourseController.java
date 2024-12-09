package com.group.project.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.entities.UserRating;
import com.group.project.repositories.CourseRepository;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.repositories.UserRatingRepository;
import com.group.project.utils.domain.DomainMapper;
import com.group.project.utils.domain.UniversityStrings;
import com.group.project.types.presentation.PrivateCourseDetails;
import com.group.project.types.presentation.PublicCourseDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
public class CourseController {
    @Autowired
    private final CourseRepository courseRepository;

    @Autowired
    private final UserRatingRepository userRatingRepository;

    @Autowired
    private final UserInterestRepository userInterestRepository;

    public CourseController(CourseRepository courseRepository, UserRatingRepository userRatingRepository, UserInterestRepository userInterestRepository) {
        this.courseRepository = courseRepository;
        this.userRatingRepository = userRatingRepository;
        this.userInterestRepository = userInterestRepository;
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
                Optional<Course> course = courseRepository.findByCode(courseCode);
                if (course.isPresent()) {
                    // Count upvotes and downvotes for course
                    int upvotes = userRatingRepository.countByCourseAndRatingEquals(course.get(), DomainMapper.UPVOTE);
                    int downvotes = userRatingRepository.countByCourseAndRatingEquals(course.get(), DomainMapper.DOWNVOTE);
                    coursesDetails.add(new PublicCourseDetails(course.get(), upvotes, downvotes));
                }
            }

            return ResponseEntity.ok(coursesDetails);
        }
    }

    @RestController
    @RequestMapping("/private/course")
    public class PrivateCourseController {
        @GetMapping("/{courseCode}")
        public ResponseEntity<Object> getCourseDetails(@RequestAttribute User currentUser,
                @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Optional<Course> course = courseRepository.findByCode(courseCode);

            // Return 404 if no matching course is found
            if (!course.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Count upvotes and downvotes for course
            int upvotes = userRatingRepository.countByCourseAndRatingEquals(course.get(), DomainMapper.UPVOTE);
            int downvotes = userRatingRepository.countByCourseAndRatingEquals(course.get(), DomainMapper.DOWNVOTE);

            // Get currentUser's rating for course
            int user_rating = 0;
            Optional<UserRating> userRating = userRatingRepository.findByUserAndCourse(currentUser, course.get());
            if (userRating.isPresent()) {
                user_rating = userRating.get().getRating();
            }

            return ResponseEntity.ok(new PrivateCourseDetails(course.get(), upvotes, downvotes, user_rating));
        }

        @PutMapping("/{courseCode}/interest")
        public ResponseEntity<Object> putUserInterest(@RequestAttribute User currentUser, @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Optional<Course> course = courseRepository.findByCode(courseCode);

            // Return 404 if no matching course is found
            if (!course.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Create interest if not already set
            if(!userInterestRepository.findByUserAndCourse(currentUser, course.get()).isPresent()) {                
                UserInterest userInterest = new UserInterest(currentUser, course.get());
                userInterest = userInterestRepository.save(userInterest);
            }
            return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{courseCode}/interest")
        public ResponseEntity<Object> deleteUserInterest(@RequestAttribute User currentUser, @PathVariable String courseCode) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Optional<Course> course = courseRepository.findByCode(courseCode);

            // Return 404 if no matching course is found
            if (!course.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Delete interest if not set
            if(userInterestRepository.findByUserAndCourse(currentUser, course.get()).isPresent()) {                
                userInterestRepository.deleteByUserAndCourse(currentUser, course.get());
            }
            return ResponseEntity.ok().build();
        }

        @PostMapping("/{courseCode}/rating")
        public ResponseEntity<Object> postCourseRating(@RequestAttribute User currentUser, @PathVariable String courseCode, @RequestParam int v) {
            courseCode = UniversityStrings.standardizeCourseCode(courseCode);
            Optional<Course> course = courseRepository.findByCode(courseCode);

            // Return 404 if no matching course is found
            if (!course.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            
            // Create record if no existing rating exists
            UserRating userRating = userRatingRepository.findByUserAndCourse(currentUser, course.get()).orElse(new UserRating(currentUser, course.get()));
            try {
                userRating.setRating(v);
            } catch (Exception e) {
                // Return 400 if rating value is an illegal one
                return ResponseEntity.badRequest().body(e.getMessage());
            }

            userRatingRepository.save(userRating);
            return ResponseEntity.ok().build();
        }
        
    }
}
