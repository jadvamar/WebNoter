package com.webNoter.Entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Subfolders")
public class SubFolders {

    @Id
    private String id;

    private String projectName;

    private String projectId;
}
