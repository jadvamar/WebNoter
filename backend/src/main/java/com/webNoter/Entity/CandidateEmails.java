package com.webNoter.Entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "CandidateEmails")
public class CandidateEmails {

    @Id
    private String id;

    private String email;

    private List<String> projectId;
}
