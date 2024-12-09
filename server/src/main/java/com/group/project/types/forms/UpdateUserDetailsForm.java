package com.group.project.types.forms;

import java.util.Optional;

public class UpdateUserDetailsForm {
    final public Optional<String> major;
    final public Optional<String> minor;
    final public Optional<String> tags;
    final public Optional<Integer> gradYear;
    final public Optional<String> gradSemester;
    
    public UpdateUserDetailsForm(Optional<String> major, Optional<String> minor, Optional<String> tags,
            Optional<Integer> gradYear, Optional<String> gradSemester) {
        this.major = major;
        this.minor = minor;
        this.tags = tags;
        this.gradYear = gradYear;
        this.gradSemester = gradSemester;
    }
}
