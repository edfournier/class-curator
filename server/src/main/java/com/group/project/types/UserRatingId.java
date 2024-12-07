package com.group.project.types;

import java.io.Serializable;

import com.group.project.entities.User;
import com.group.project.entities.UniClass;

public class UserRatingId implements Serializable{
    public User user;
    public UniClass uniClass;
}
