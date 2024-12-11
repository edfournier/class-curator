package com.group.project.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.group.project.controller.CourseController.PrivateCourseController;
import com.group.project.controller.CourseController.PublicCourseController;
import com.group.project.entities.AggrRating;
import com.group.project.entities.Course;
import com.group.project.entities.Friendship;
import com.group.project.entities.UniClass;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.entities.UserRating;
import com.group.project.repositories.AggrRatingRepository;
import com.group.project.repositories.CourseRepository;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.repositories.UserRatingRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.types.common.UniversitySession;
import com.group.project.types.presentation.CourseInsights;
import com.group.project.types.presentation.PublicCourseDetails;

public class CourseControllerTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FriendshipRepository friendshipRepository;

    @Mock
    private UserRatingRepository userRatingRepository;

    @Mock
    private UserInterestRepository userInterestRepository;

    @Mock
    private AggrRatingRepository aggrRatingRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private CourseController courseController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void searchCoursesChecks() {
        // Setup
        PublicCourseController controller = courseController.new PublicCourseController();
        String search_query = "";
        List<Course> courses = List.of(
                new Course());
        when(courseRepository.findByCodeContaining(search_query)).thenReturn(courses);

        // Act
        ResponseEntity res = controller.searchCourses(search_query);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(courses);
    }

    @Test
    void getBulkCourseDetailsChecks() {
        // Setup
        PublicCourseController controller = courseController.new PublicCourseController();
        String code1 = "CODE 1";
        String code2 = "CODE 2";
        String code3 = "CODE 3";
        String courseCodes = code1 + "," + code2 + "," + code3;
        Course course1 = new Course();
        Course course3 = new Course();

        when(courseRepository.findByCode(code1)).thenReturn(Optional.of(course1));
        when(courseRepository.findByCode(code2)).thenReturn(Optional.empty());
        when(courseRepository.findByCode(code3)).thenReturn(Optional.of(course3));
        when(userRatingRepository.countByCourseAndRatingEquals(course1, 1)).thenReturn(2);
        when(userRatingRepository.countByCourseAndRatingEquals(course1, -1)).thenReturn(2);
        when(userRatingRepository.countByCourseAndRatingEquals(course3, 1)).thenReturn(4);
        when(userRatingRepository.countByCourseAndRatingEquals(course3, -1)).thenReturn(0);

        // Act
        ResponseEntity res = controller.getBulkCourseDetails(courseCodes);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<PublicCourseDetails> body = (List<PublicCourseDetails>) res.getBody();
        assertThat(body).hasSize(2);
    }

    @Test
    void getCourseInsightsChecks() {
        // Setup
        PublicCourseController controller = courseController.new PublicCourseController();
        String courseCode = "CODE 1";
        Course course = new Course();
        UniClass uniClass = new UniClass(course, new UniversitySession(), "prof");
        List<AggrRating> ratings = List.of(
                new AggrRating(uniClass));

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(aggrRatingRepository.findByCourse(course)).thenReturn(ratings);

        // Act
        ResponseEntity res = controller.getCourseInsights(courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseInsights body = (CourseInsights) res.getBody();
        assertThat(body.ratingHistory).hasSize(1);
        assertThat(body.profRatings).hasSize(1);
    }

    @Test
    void getCourseInsightsMissingCourseChecks() {
        // Setup
        PublicCourseController controller = courseController.new PublicCourseController();
        String courseCode = "CODE 123";

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getCourseInsights(courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void getCourseDetailsChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();

        UserRating userRating = new UserRating(mockUser, course);
        UserInterest userInterest = new UserInterest(mockUser, course);

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.countByCourseAndRatingEquals(course, 1)).thenReturn(2);
        when(userRatingRepository.countByCourseAndRatingEquals(course, -1)).thenReturn(3);
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(userRating));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(userInterest));

        // Act
        ResponseEntity res = controller.getCourseDetails(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getCourseDetailsNoInterestChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();

        UserRating userRating = new UserRating(mockUser, course);

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.countByCourseAndRatingEquals(course, 1)).thenReturn(2);
        when(userRatingRepository.countByCourseAndRatingEquals(course, -1)).thenReturn(3);
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(userRating));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getCourseDetails(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getCourseDetailsNoRatingChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();

        UserRating userRating = new UserRating(mockUser, course);

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.countByCourseAndRatingEquals(course, 1)).thenReturn(2);
        when(userRatingRepository.countByCourseAndRatingEquals(course, -1)).thenReturn(3);
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getCourseDetails(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getCourseDetailsNoCourseChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getCourseDetails(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void putCourseInterestNoCourseChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.putUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void putCourseInterestInterestExistsChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();
        UserInterest interest = new UserInterest();

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(interest));

        // Act
        ResponseEntity res = controller.putUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void putCourseInterestChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();
        UserInterest interest = new UserInterest();

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());
        when(userInterestRepository.save(any())).thenReturn(interest);

        // Act
        ResponseEntity res = controller.putUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void deleteCourseInterestNoCourseChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.deleteUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void deleteCourseInterestNoInterestExistsChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.deleteUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void deleteCourseInterestChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        Course course = new Course();
        UserInterest interest = new UserInterest();

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userInterestRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(interest));
        when(userInterestRepository.removeByUserAndCourse(mockUser, course)).thenReturn(1l);

        // Act
        ResponseEntity res = controller.deleteUserInterest(mockUser, courseCode);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postCourseRatingNoCourseChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        int newRatingValue = 0;

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.postCourseRating(mockUser, courseCode, newRatingValue);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postCourseRatingNoExistingRatingChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        int newRatingValue = 0;
        Course course = new Course();

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.postCourseRating(mockUser, courseCode, newRatingValue);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postCourseRatingInvalidRatingChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        int newRatingValue = 7;
        Course course = new Course();
        UserRating rating = new UserRating(mockUser, course);

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(rating));

        // Act
        ResponseEntity res = controller.postCourseRating(mockUser, courseCode, newRatingValue);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).isEqualTo("Invalid Rating Value!");
    }

    @Test
    void postCourseRatingChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        String courseCode = "CODE 1";
        int newRatingValue = 1;
        Course course = new Course();
        UserRating rating = new UserRating(mockUser, course);

        when(courseRepository.findByCode(courseCode)).thenReturn(Optional.of(course));
        when(userRatingRepository.findByUserAndCourse(mockUser, course)).thenReturn(Optional.of(rating));

        // Act
        ResponseEntity res = controller.postCourseRating(mockUser, courseCode, newRatingValue);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getRecommendationChecks() {
        // Setup
        PrivateCourseController controller = courseController.new PrivateCourseController();
        User mockUser = new User();
        mockUser._setId(1);
        mockUser.setGradSession(new UniversitySession());
        Course course = new Course();
        User f1 = new User();
        User p1 = new User();

        String mockResponseString = "{\"recommended_courses\":[\"CODE 1\"]}";

        when(restTemplate.getForObject(Mockito.anyString(), any())).thenReturn(mockResponseString);
        when(courseRepository.findByCode(any())).thenReturn(Optional.of(course));
        when(friendshipRepository.findByUser1(any())).thenReturn(List.of(new Friendship(mockUser, f1)));
        when(friendshipRepository.findByUser2(any())).thenReturn(List.of());
        when(userInterestRepository.findByUser(f1)).thenReturn(List.of());
        when(userRepository.findByGradSession(any())).thenReturn(List.of(p1));
        when(userInterestRepository.findByUser(p1)).thenReturn(List.of());

        // Act
        ResponseEntity res = controller.getRecommendation(mockUser);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
