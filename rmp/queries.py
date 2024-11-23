ratings = """
    query RatingsListQuery(
        $count: Int!
        $id: ID!
        $courseFilter: String
        $cursor: String
        ) {
        node(id: $id) {
            __typename
            ... on Teacher {
            ...RatingsList_teacher_4pguUW
            }
            id
        }
    }

    fragment RatingsList_teacher_4pguUW on Teacher {
        id
        legacyId
        lastName
        numRatings
        school {
            id
            legacyId
            name
            city
            state
            avgRating
            numRatings
        }
        ...Rating_teacher
        ...NoRatingsArea_teacher
        ratings(first: $count, after: $cursor, courseFilter: $courseFilter) {
            edges {
            cursor
            node {
                ...Rating_rating
                id
                __typename
            }
            }
            pageInfo {
            hasNextPage
            endCursor
            }
        }
    }

    fragment Rating_teacher on Teacher {
        ...RatingFooter_teacher
        ...RatingSuperHeader_teacher
        ...ProfessorNoteSection_teacher
    }

    fragment NoRatingsArea_teacher on Teacher {
        lastName
        ...RateTeacherLink_teacher
    }

    fragment Rating_rating on Rating {
        comment
        flagStatus
        createdByUser
        teacherNote {
            id
        }
        ...RatingHeader_rating
        ...RatingSuperHeader_rating
        ...RatingValues_rating
        ...CourseMeta_rating
        ...RatingTags_rating
        ...RatingFooter_rating
        ...ProfessorNoteSection_rating
    }

    fragment RatingHeader_rating on Rating {
        legacyId
        date
        class
        helpfulRating
        clarityRating
        isForOnlineClass
    }

    fragment RatingSuperHeader_rating on Rating {
        legacyId
    }

    fragment RatingValues_rating on Rating {
        helpfulRating
        clarityRating
        difficultyRating
    }

    fragment CourseMeta_rating on Rating {
        attendanceMandatory
        wouldTakeAgain
        grade
        textbookUse
        isForOnlineClass
        isForCredit
    }

    fragment RatingTags_rating on Rating {
        ratingTags
    }

    fragment RatingFooter_rating on Rating {
        id
        comment
        adminReviewedAt
        flagStatus
        legacyId
        thumbsUpTotal
        thumbsDownTotal
        thumbs {
            thumbsUp
            thumbsDown
            computerId
            id
        }
        teacherNote {
            id
        }
        ...Thumbs_rating
    }

    fragment ProfessorNoteSection_rating on Rating {
        teacherNote {
            ...ProfessorNote_note
            id
        }
        ...ProfessorNoteEditor_rating
    }

    fragment ProfessorNote_note on TeacherNotes {
        comment
        ...ProfessorNoteHeader_note
        ...ProfessorNoteFooter_note
    }

    fragment ProfessorNoteEditor_rating on Rating {
        id
        legacyId
        class
        teacherNote {
            id
            teacherId
            comment
        }
    }

    fragment ProfessorNoteHeader_note on TeacherNotes {
        createdAt
        updatedAt
    }

    fragment ProfessorNoteFooter_note on TeacherNotes {
        legacyId
        flagStatus
    }

    fragment Thumbs_rating on Rating {
        id
        comment
        adminReviewedAt
        flagStatus
        legacyId
        thumbsUpTotal
        thumbsDownTotal
        thumbs {
            computerId
            thumbsUp
            thumbsDown
            id
        }
        teacherNote {
            id
        }
    }

    fragment RateTeacherLink_teacher on Teacher {
        legacyId
        numRatings
        lockStatus
    }

    fragment RatingFooter_teacher on Teacher {
        id
        legacyId
        lockStatus
        isProfCurrentUser
        ...Thumbs_teacher
    }

    fragment RatingSuperHeader_teacher on Teacher {
        firstName
        lastName
        legacyId
        school {
            name
            id
        }
    }

    fragment ProfessorNoteSection_teacher on Teacher {
        ...ProfessorNote_teacher
        ...ProfessorNoteEditor_teacher
    }

    fragment ProfessorNote_teacher on Teacher {
        ...ProfessorNoteHeader_teacher
        ...ProfessorNoteFooter_teacher
    }

    fragment ProfessorNoteEditor_teacher on Teacher {
        id
    }

    fragment ProfessorNoteHeader_teacher on Teacher {
        lastName
    }

    fragment ProfessorNoteFooter_teacher on Teacher {
        legacyId
        isProfCurrentUser
    }

    fragment Thumbs_teacher on Teacher {
        id
        legacyId
        lockStatus
        isProfCurrentUser
    }
"""

profs = """
    query TeacherSearchPaginationQuery(
    $count: Int!
    $cursor: String
    $query: TeacherSearchQuery!
    ) {
    search: newSearch {
        teachers(query: $query, first: $count, after: $cursor) {
        edges {
            node {
            id
            avgRating
            numRatings
            firstName
            lastName
            }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
        }
    }
}
"""