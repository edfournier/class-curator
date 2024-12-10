package com.group.project.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
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

import com.group.project.entities.FriendRequest;
import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendRequestRepository;
import com.group.project.repositories.FriendshipRepository;
import com.group.project.repositories.UserRepository;

public class FriendControllerTest {
    @Mock
    UserRepository userRepository;

    @Mock
    FriendshipRepository friendshipRepository;

    @Mock
    FriendRequestRepository friendRequestRepository;

    @InjectMocks
    FriendController friendController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void getFriendChecks() {
        // Setup
        User mockUser = new User();
        User f1 = new User();
        User f2 = new User();
        List<Friendship> leftHalf = List.of(new Friendship(mockUser, f2));
        List<Friendship> rightHalf = List.of(new Friendship(f1, mockUser));
        when(friendshipRepository.findByUser1(mockUser)).thenReturn(leftHalf);
        when(friendshipRepository.findByUser2(mockUser)).thenReturn(rightHalf);

        List<User> expectedFriendsList = List.of(f2, f1);

        // Act
        ResponseEntity res = friendController.getFriends(mockUser);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<User> body = (List<User>) res.getBody();
        assertThat(body).containsExactlyElementsOf(expectedFriendsList);
    }

    @Test
    void deleteFriendshipChecks() {
        // Setup
        User mockUser = new User();
        int mockFriendId = 1;
        User friend = new User();
        friend._setId(mockFriendId);
        Friendship friendship = new Friendship(mockUser, friend);

        when(userRepository.findById(mockFriendId)).thenReturn(Optional.of(friend));
        when(friendshipRepository.findByUser1AndUser2(mockUser, friend)).thenReturn(Optional.of(friendship));
        doNothing().when(friendshipRepository).delete(friendship);

        // Act
        ResponseEntity res = friendController.deleteFriendship(mockUser, mockFriendId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void deleteFriendshipForMissingFriendChecks() {
        // Setup
        User mockUser = new User();
        int mockFriendId = 1;

        when(userRepository.findById(mockFriendId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.deleteFriendship(mockUser, mockFriendId);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void deleteMissingFriendshipForFriendChecks() {
        // Setup
        User mockUser = new User();
        int mockFriendId = 1;
        User friend = new User();
        friend._setId(mockFriendId);

        when(userRepository.findById(mockFriendId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.deleteFriendship(mockUser, mockFriendId);
        when(userRepository.findById(mockFriendId)).thenReturn(Optional.of(friend));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void getReceivedFriendRequestsChecks() throws Exception {
        // Setup
        User mockUser = new User();
        User f1 = new User();
        List<FriendRequest> receivedFriendRequests = List.of(new FriendRequest(f1, mockUser));
        when(friendRequestRepository.findByReceiver(mockUser)).thenReturn(receivedFriendRequests);
        
        List<User> expectedFriendsList = List.of(f1);

        // Act
        ResponseEntity res = friendController.getReceivedFriendRequests(mockUser);

        // Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<User> body = (List<User>) res.getBody();
        assertThat(body).containsExactlyElementsOf(expectedFriendsList);
    }

    @Test
    void acceptReceivedFriendRequestChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long senderId = 1;
        User sender = new User();
        sender._setId(senderId);
        FriendRequest frReq = new FriendRequest(sender, mockUser);

        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(sender, mockUser)).thenReturn(Optional.of(frReq));
        when(friendRequestRepository.removeBySenderAndReceiver(sender, mockUser)).thenReturn(null);
        when(friendshipRepository.save(any())).thenReturn(null);

        // Act
        ResponseEntity res = friendController.acceptReceivedFriendRequest(mockUser, senderId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void acceptReceivedFriendRequestMissingReqChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long senderId = 1;
        User sender = new User();
        sender._setId(senderId);

        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(sender, mockUser)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.acceptReceivedFriendRequest(mockUser, senderId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void acceptReceivedFriendRequestExistingFrChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long senderId = 1;
        User sender = new User();
        sender._setId(senderId);
        Friendship fr = new Friendship(mockUser, sender);

        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.of(fr));

        // Act
        ResponseEntity res = friendController.acceptReceivedFriendRequest(mockUser, senderId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).isEqualTo("Friendship already exists!");
    }

    @Test
    void acceptReceivedFriendRequestMissingUserChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long senderId = 1;

        when(userRepository.findById(senderId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.acceptReceivedFriendRequest(mockUser, senderId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void createFriendRequestChecks() throws Exception {
        // Setup
        User mockUser = new User();
        String targetUsername = "targetUsername";
        int targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);

        when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.of(targetUser));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(mockUser, targetUser)).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(targetUser, mockUser)).thenReturn(Optional.empty());
        when(friendRequestRepository.save(any())).thenReturn(null);

        // Act
        ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void createFriendRequestSelfReqChecks() throws Exception {
        // Setup
        User mockUser = new User();
        String targetUsername = "targetUsername";
        User targetUser = mockUser;

        when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.of(targetUser));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(mockUser, targetUser)).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(targetUser, mockUser)).thenReturn(Optional.empty());


        // Act
        ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).isEqualTo("Cannot send friend request to self");
    }

    // @Test
    // void createFriendRequestExistingFrChecks() throws Exception {
    //     // Setup
    //     User mockUser = new User();
    //     mockUser._setId(0);
    //     String targetUsername = "targetUsername";
    //     int targetUserId = 2;
    //     User targetUser = new User();
    //     targetUser._setId(targetUserId);
    //     FriendRequest frReq = new FriendRequest(targetUser, mockUser);

    //     when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.of(targetUser));
    //     when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
    //     when(friendRequestRepository.findBySenderAndReceiver(mockUser, targetUser)).thenReturn(Optional.empty());
    //     when(friendRequestRepository.findBySenderAndReceiver(targetUser, mockUser)).thenReturn(Optional.of(frReq));

    //     // Act
    //     ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

    //     //Assert
    //     assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    //     assertThat(res.getBody()).isEqualTo(null);
    // }

    @Test
    void createFriendRequestRepeatChecks() throws Exception {
        // Setup
        User mockUser = new User();
        String targetUsername = "targetUsername";
        int targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);
        FriendRequest frReq = new FriendRequest(mockUser, targetUser);

        when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.of(targetUser));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.empty());
        when(friendRequestRepository.findBySenderAndReceiver(mockUser, targetUser)).thenReturn(Optional.of(frReq));

        // Act
        ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void createFriendRequestAlreadyFriendsChecks() throws Exception {
        // Setup
        User mockUser = new User();
        String targetUsername = "targetUsername";
        int targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);
        Friendship fr = new Friendship(mockUser, targetUser);

        when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.of(targetUser));
        when(friendshipRepository.findByUser1AndUser2(any(), any())).thenReturn(Optional.of(fr));

        // Act
        ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).isEqualTo("Friendship already exists!");
    }

    @Test
    void createFriendRequestMissingUserChecks() throws Exception {
        // Setup
        User mockUser = new User();
        String targetUsername = "targetUsername";
        int targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);
        Friendship fr = new Friendship(mockUser, targetUser);

        when(userRepository.findByUsername(targetUsername)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.createFriendRequest(mockUser, targetUsername);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void deleteReceivedFriendRequestChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);
        FriendRequest frReq = new FriendRequest(targetUser, mockUser);

        when(userRepository.findById(targetUserId)).thenReturn(Optional.of(targetUser));
        when(friendRequestRepository.findBySenderAndReceiver(targetUser, mockUser)).thenReturn(Optional.of(frReq));

        // Act
        ResponseEntity res = friendController.deleteReceivedFriendRequest(mockUser, targetUserId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void deleteReceivedFriendRequestMissingReqChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long targetUserId = 2;
        User targetUser = new User();
        targetUser._setId(targetUserId);
        FriendRequest frReq = new FriendRequest(targetUser, mockUser);

        when(userRepository.findById(targetUserId)).thenReturn(Optional.of(targetUser));
        when(friendRequestRepository.findBySenderAndReceiver(targetUser, mockUser)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.deleteReceivedFriendRequest(mockUser, targetUserId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }

    @Test
    void deleteReceivedFriendRequestMissingUserChecks() throws Exception {
        // Setup
        User mockUser = new User();
        long targetUserId = 2;

        when(userRepository.findById(targetUserId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity res = friendController.deleteReceivedFriendRequest(mockUser, targetUserId);

        //Assert
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(res.getBody()).isEqualTo(null);
    }
}
