package com.group.project.entities;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class FriendshipTest {
    @Test
    void basicConstructorChecks() {
        // Setup
        User user1 = new User();
        User user2 = new User();

        // Act
        Friendship friendship = new Friendship(user1, user2);

        // Assert
        assertThat(friendship.getUser1()).isEqualTo(user1);
        assertThat(friendship.getUser2()).isEqualTo(user2);
    }

    @Test
    void unidirectionalGraphChecks() {
        // Setup
        User user1 = new User();
        User user2 = new User();
        user2._setId(2);

        // Act
        Friendship friendship = new Friendship(user2, user1);

        // Assert
        assertThat(friendship.getUser1()).isEqualTo(user1);
        assertThat(friendship.getUser2()).isEqualTo(user2);
    }
}
