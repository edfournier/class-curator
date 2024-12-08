package com.group.project.controller;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group.project.entities.Course;
import com.group.project.entities.FriendRequest;
import com.group.project.entities.Friendship;
import com.group.project.entities.AggrRating;
import com.group.project.entities.UserRating;
import com.group.project.entities.UniClass;
import com.group.project.entities.User;
import com.group.project.repositories.CourseRepository;
import com.group.project.repositories.FriendRequestRepository;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.AggrRatingRepository;
import com.group.project.repositories.UserRatingRepository;
import com.group.project.repositories.UniClassRepository;
import com.group.project.repositories.UserRepository;
import com.group.project.types.UniversitySession;

@RestController
@RequestMapping("/")
public class TestController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    UniClassRepository uniClassRepository;

    @Autowired
    AggrRatingRepository aggrRatingRepository;

    @Autowired
    UserRatingRepository userRatingRepository;

    @Autowired
    FriendshipRepository friendshipRepository;

    @Autowired
    FriendRequestRepository friendRequestRepository;

    // Example of using private endpoint
    @GetMapping("/private/hello")
    public String hello(@RequestAttribute String username) {
        return "Hello " + username + "!";
    }

    // Example of using public endpoint
    @GetMapping("/")
    public String defaultGreet() {
        return "Hello User! Launch the extension to see more or hit the /test API to try your luck :P";
    }

    // testing ground for DB fns
    @GetMapping("/testFriendship")
    public ResponseEntity<Object> testFriendship(@RequestParam String u1, @RequestParam String u2) {
        User user1 = userRepository.findByUsername(u2)
                .orElse(new User(u2, "U2", new UniversitySession(2024, "FALL"), "Computer Science"));
        User user2 = userRepository.findByUsername(u1)
                .orElse(new User(u1, "U1", new UniversitySession(2024, "FALL"), "Computer Science"));

        userRepository.save(user1);
        userRepository.save(user2);

        // Because unidirectional graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }

        Friendship friendship_new = new Friendship(user1, user2);
        friendship_new = friendshipRepository.save(friendship_new);

        List<Friendship> leftHalf = friendshipRepository.findByUser1(user2);
        List<Friendship> rightHalf = friendshipRepository.findByUser2(user2);
        Stream<User> leftHalfFriends = leftHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser2()));
        Stream<User> rightHalfFriends = rightHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser1()));
        Stream<User> friendsStream = Stream.concat(leftHalfFriends, rightHalfFriends);

        // // TODO: Handle missing friendship
        // Friendship friendship = friendshipRepository.findByUser1AndUser2(user1,
        // user2).orElseThrow();

        // friendshipRepository.delete(friendship);
        return ResponseEntity.ok(friendsStream.toList());
    }

    @GetMapping("/testFriendReq")
    public ResponseEntity<Object> testFriendshipReq(@RequestParam String u1, @RequestParam String u2) {
        User user1 = userRepository.findByUsername(u2)
                .orElse(new User(u2, "U2", new UniversitySession(2024, "FALL"), "Computer Science"));
        User user2 = userRepository.findByUsername(u1)
                .orElse(new User(u1, "U1", new UniversitySession(2024, "FALL"), "Computer Science"));

        userRepository.save(user1);
        userRepository.save(user2);

        // Because unidirectional graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }

        FriendRequest friendship_new = new FriendRequest(user1, user2);
        friendship_new = friendRequestRepository.save(friendship_new);

        List<FriendRequest> leftHalf = friendRequestRepository.findByUser1(user2);
        List<FriendRequest> rightHalf = friendRequestRepository.findByUser2(user2);
        Stream<User> leftHalfFriends = leftHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser2()));
        Stream<User> rightHalfFriends = rightHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser1()));
        Stream<User> friendsStream = Stream.concat(leftHalfFriends, rightHalfFriends);

        // // TODO: Handle missing friendship
        // Friendship friendship = friendshipRepository.findByUser1AndUser2(user1,
        // user2).orElseThrow();

        // friendshipRepository.delete(friendship);
        return ResponseEntity.ok(friendsStream.toList());
    }

    @GetMapping("/testRating")
    public ResponseEntity<Object> testRating(@RequestParam String code, @RequestParam String semester,
            @RequestParam int year, @RequestParam int rating) {
        Course course = courseRepository.findByCode(code).get();
        UniClass uniClass = uniClassRepository.findByCourseAndSession(course, new UniversitySession(year, semester))
                .getFirst();

        User user = userRepository.findByUsername("u1").orElseThrow();

        UserRating userRating = userRatingRepository.findByUserAndUniClass(user, uniClass)
                .orElse(new UserRating(user, uniClass, rating));
        userRating.setRating(rating);
        userRating = userRatingRepository.save(userRating);

        return ResponseEntity.ok(userRating);
    }

    @GetMapping("/testRating2")
    public ResponseEntity<Object> testRating2(@RequestParam String code, @RequestParam String semester,
            @RequestParam int year) {
        Course course = courseRepository.findByCode(code).get();

        List<AggrRating> aggrRatings = aggrRatingRepository.findByCourse(course);
        return ResponseEntity.ok(aggrRatings);

        // UniClass uniClass = uniClassRepository.findByCourseAndSession(course, new
        // UniversitySession(year, semester)).getFirst();
        // AggrRating aggrRating =
        // aggrRatingRepository.findByUniClass(uniClass).orElseThrow();
        // return ResponseEntity.ok(aggrRating);
    }
}
