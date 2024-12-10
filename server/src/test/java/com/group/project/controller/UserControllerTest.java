package com.group.project.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.group.project.controller.UserController.PrivateUserController;
import com.group.project.controller.UserController.PublicUserController;
import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.types.common.UniversitySession;
import com.group.project.types.forms.UpdateUserDetailsForm;

public class UserControllerTest {
    @Mock
    UserRepository userRepository;

    @Mock
    UserInterestRepository userInterestRepository;

    @InjectMocks
    UserController userController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void getUserDetailsChecks(){
        // Setup
        PublicUserController controller = userController.new PublicUserController();
        int mockUserId = 1;
        User mockUser = new User();

        when(userRepository.findById(mockUserId)).thenReturn(Optional.of(mockUser));

        // Act
        ResponseEntity res = controller.getUserDetails(mockUserId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
    }

    @Test
    void getMissingUserDetailsChecks(){
        // Setup
        PublicUserController controller = userController.new PublicUserController();
        int mockUserId = 1;

        when(userRepository.findById(mockUserId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getUserDetails(mockUserId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void getUserInterestsChecks(){
        // Setup
        PublicUserController controller = userController.new PublicUserController();
        int mockUserId = 1;
        User mockUser = new User();
        Course course1 = new Course();
        List<UserInterest> userInterests = List.of(
            new UserInterest(mockUser, course1)
        );

        List<Course> expected = List.of(course1);

        when(userRepository.findById(mockUserId)).thenReturn(Optional.of(mockUser));
        when(userInterestRepository.findByUser(mockUser)).thenReturn(userInterests);

        // Act
        ResponseEntity res = controller.getUserInterests(mockUserId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(expected);
    }

    @Test
    void getMissingUserInterestsChecks(){
        // Setup
        PublicUserController controller = userController.new PublicUserController();
        int mockUserId = 1;

        when(userRepository.findById(mockUserId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = controller.getUserInterests(mockUserId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void getCurrentUserDetailsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();

        // Act
        ResponseEntity res = controller.getCurrentUserDetails(mockUser);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
    }

    @Test
    void allEmpty_updateCurrentUserDetailsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty()
        );

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
    }

    @Test
    void major_updateCurrentUserDetailsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        String major = "Updated Major";
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.of(major), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty()
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
        User body = (User) res.getBody();
        assertThat(body.getMajor()).isEqualTo(major);
    }

    @Test
    void minor_updateCurrentUserDetailsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        String minor = "Updated minor";
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.of(minor),
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty()
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
        User body = (User) res.getBody();
        assertThat(body.getMinor()).isEqualTo(minor);
    }

    @Test
    void tags_updateCurrentUserDetailsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        String tags = "Updated tags";
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.empty(), 
            Optional.of(tags),
            Optional.empty(), 
            Optional.empty()
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
        User body = (User) res.getBody();
        assertThat(body.getTags()).isEqualTo(tags);
    }

    @Test
    void gradYear_updateCurrentUserDetailsChecks() throws Exception{
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        mockUser.setGradSession(new UniversitySession(2024, "FALL"));
        int gradYear = 2025;
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.of(gradYear),
            Optional.empty()
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
        User body = (User) res.getBody();
        assertThat(body.getGradSession().year).isEqualTo(gradYear);
    }

    @Test
    void gradSemester_updateCurrentUserDetailsChecks() throws Exception{
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        mockUser.setGradSession(new UniversitySession(2024, "FALL"));
        String gradSemester = "SPRING";
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(),
            Optional.of(gradSemester)
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(mockUser);
        User body = (User) res.getBody();
        assertThat(body.getGradSession().semester).isEqualTo(gradSemester);
    }

    @Test
    void failingRequest_updateCurrentUserDetailsChecks() throws Exception{
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        mockUser.setGradSession(new UniversitySession(2024, "FALL"));
        String gradSemester = "NOT-FALL";
        UpdateUserDetailsForm formData = new UpdateUserDetailsForm(
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(), 
            Optional.empty(),
            Optional.of(gradSemester)
        );

        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        ResponseEntity res = controller.updateCurrentUserDetails(mockUser, formData);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).isEqualTo("Semester value isn't valid!");
    }


    @Test
    void getCurrentUserInterestsChecks(){
        // Setup
        PrivateUserController controller = userController.new PrivateUserController();
        User mockUser = new User();
        Course course1 = new Course();
        List<UserInterest> userInterests = List.of(
            new UserInterest(mockUser, course1)
        );

        List<Course> expected = List.of(course1);

        when(userInterestRepository.findByUser(mockUser)).thenReturn(userInterests);

        // Act
        ResponseEntity res = controller.getCurrentUserInterests(mockUser);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(expected);
    }
}
