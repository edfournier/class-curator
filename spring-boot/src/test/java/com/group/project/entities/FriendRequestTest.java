package com.group.project.entities;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatException;

import org.junit.jupiter.api.Test;

public class FriendRequestTest {
    @Test
    void basicConstructorChecks() throws Exception {
        // Setup
        User sender = new User();
        User receiver = new User();

        // Act
        FriendRequest friendRequest = new FriendRequest(sender, receiver);

        // Assert
        assertThat(friendRequest.getSender()).isEqualTo(sender);
        assertThat(friendRequest.getReceiver()).isEqualTo(receiver);
    }

    @Test
    void sameUserThrowCheck() throws Exception {
        // Setup
        User sender = new User();

        // Act (and Assert)
        assertThatException()
                .isThrownBy(() -> new FriendRequest(sender, sender))
                .withMessage("Cannot send friend request to self");
    }
}
