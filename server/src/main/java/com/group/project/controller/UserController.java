package com.group.project.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.Course;
import com.group.project.entities.User;
import com.group.project.entities.UserInterest;
import com.group.project.repositories.UserInterestRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.types.common.UniversitySession;
import com.group.project.types.forms.UpdateUserDetailsForm;

@RestController
public class UserController {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final UserInterestRepository userInterestRepository;

    public UserController(UserRepository userRepository, UserInterestRepository userInterestRepository) {
        this.userRepository = userRepository;
        this.userInterestRepository = userInterestRepository;
    }

    @RestController
    @RequestMapping("/user")
    public class PublicUserController {
        @GetMapping("/{userId}")
        public ResponseEntity<Object> getUserDetails(@PathVariable int userId) {
            Optional<User> user = userRepository.findById(userId);

            // Return 404 if user does not exist
            if (!user.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user.get());
        }

        @GetMapping("/{userId}/interests")
        public ResponseEntity<Object> getUserInterest(@PathVariable int userId) {
            Optional<User> user = userRepository.findById(userId);

            // Return 404 if user does not exist
            if (!user.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Fetch list of course where user has marked "interested"
            List<UserInterest> userInterests = userInterestRepository.findByUser(user.get());
            List<Course> courses = userInterests.stream().flatMap(userInterest -> Stream.of(userInterest.getCourse()))
                    .toList();
            return ResponseEntity.ok(courses);
        }
    }

    @RestController
    @RequestMapping("/private/user")
    public class PrivateUserController {
        @GetMapping
        public ResponseEntity<User> getCurrentUserDetails(@RequestAttribute User currentUser) {
            return ResponseEntity.ok(currentUser);
        }

        @PutMapping
        public ResponseEntity<Object> updateCurrentUserDetails(@RequestAttribute User currentUser,
                @RequestBody UpdateUserDetailsForm formData) {
            boolean updated = false; // flag to track if entity has changed

            if (formData.major.isPresent()) {
                currentUser.setMajor(formData.major.get());
                updated = true;
            }

            if (formData.minor.isPresent()) {
                currentUser.setMinor(formData.minor.get());
                updated = true;
            }

            if (formData.gradYear.isPresent() || formData.gradSemester.isPresent()) {
                UniversitySession updatedGradSession;
                try {
                    // Fill in the blanks with existing values if either semester or year has changed
                    updatedGradSession = new UniversitySession(
                            formData.gradYear.orElse(currentUser.getGradSession().year),
                            formData.gradSemester.orElse(currentUser.getGradSession().semester));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
                currentUser.setGradSession(updatedGradSession);
                updated = true;
            }

            if (formData.tags.isPresent()) {
                currentUser.setTags(formData.tags.get());
                updated = true;
            }

            // Only attempt save if entity has changed
            if (updated) {
                currentUser = userRepository.save(currentUser);
            }

            return ResponseEntity.ok(currentUser);
        }

        @GetMapping("/interests")
        public ResponseEntity<Object> getUserInterest(@RequestAttribute User currentUser) {
            // Fetch list of course where user has marked "interested"
            List<UserInterest> userInterests = userInterestRepository.findByUser(currentUser);
            List<Course> courses = userInterests.stream().flatMap(userInterest -> Stream.of(userInterest.getCourse()))
                    .toList();
            return ResponseEntity.ok(courses);
        }
    }
}