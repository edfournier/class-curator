package com.group.project.utils;

import java.util.List;
import java.util.stream.Stream;

import com.group.project.entities.Friendship;
import com.group.project.entities.User;
import com.group.project.repositories.FriendshipRepository;

public interface PeopleUtils {
    public static List<User> getAllFriends(FriendshipRepository friendshipRepository, User user) {
        // Friendships are a undirected graph, so need two queries to get full list
        List<Friendship> leftHalf = friendshipRepository.findByUser1(user);
        List<Friendship> rightHalf = friendshipRepository.findByUser2(user);
        Stream<User> leftHalfFriends = leftHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser2()));
        Stream<User> rightHalfFriends = rightHalf.stream().flatMap(friendship -> Stream.of(friendship.getUser1()));
        Stream<User> friendsStream = Stream.concat(leftHalfFriends, rightHalfFriends);
        return friendsStream.toList();
    }

    public static Friendship getExistingFriendship(FriendshipRepository friendshipRepository, User user1, User user2) {
        // Because friendship is an undirected graph
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }
        return friendshipRepository.findByUser1AndUser2(user1, user2).orElse(null);
    }
}
