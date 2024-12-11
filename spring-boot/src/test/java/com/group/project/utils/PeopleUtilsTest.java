package com.group.project.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendshipRepository;

public class PeopleUtilsTest {
    @Mock
    private FriendshipRepository friendshipRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void getAllFriendsCheck() {
        // Setup
        User testUser = new User();
        User f1 = new User();
        User f2 = new User();
        List<Friendship> leftHalf = List.of(new Friendship(testUser, f2));
        List<Friendship> rightHalf = List.of(new Friendship(f1, testUser));
        when(friendshipRepository.findByUser1(testUser)).thenReturn(leftHalf);
        when(friendshipRepository.findByUser2(testUser)).thenReturn(rightHalf);

        List<User> expectedFriendsList = List.of(f2, f1);

        // Act (and Assert)
        assertThat(PeopleUtils.getAllFriends(friendshipRepository, testUser)).hasSameElementsAs(expectedFriendsList);
    }

    @Test
    void getExistingFriendshipCheck() {
        // Setup
        User user1 = new User();
        User user2 = new User();
        Optional<Friendship> friendship = Optional.of(new Friendship(user1, user2));
        when(friendshipRepository.findByUser1AndUser2(user1, user2)).thenReturn(friendship);

        // Act (and Assert)
        assertThat(PeopleUtils.getExistingFriendship(friendshipRepository, user1, user2)).isEqualTo(friendship.get());
    }

    @Test
    void getExistingUnidirectionalFriendshipFriendshipCheck() {
        // Setup
        User user1 = new User();
        User user2 = new User();
        user2._setId(2);
        Optional<Friendship> friendship = Optional.of(new Friendship(user1, user2));
        when(friendshipRepository.findByUser1AndUser2(user1, user2)).thenReturn(friendship);

        // Act (and Assert)
        assertThat(PeopleUtils.getExistingFriendship(friendshipRepository, user2, user1)).isEqualTo(friendship.get());
    }

    @Test
    void getMissingFriendshipCheck() {
        // Setup
        User user1 = new User();
        User user2 = new User();
        Optional<Friendship> friendship = Optional.empty();
        when(friendshipRepository.findByUser1AndUser2(user1, user2)).thenReturn(friendship);

        // Act (and Assert)
        assertThat(PeopleUtils.getExistingFriendship(friendshipRepository, user1, user2)).isEqualTo(null);
    }
}
