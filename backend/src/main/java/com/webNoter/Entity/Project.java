package com.webNoter.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.annotation.Collation;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Project")
public class Project {

    @Id
    private String id;

    private String projectName;

}
