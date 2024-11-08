package com.webNoter.Entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "NotesData")
public class NotesData {

    @Id
    private String Id;

    private String Link;

    private String heading;

    private String description;

    private Date date;

    private List<String> subFolderId;
}
