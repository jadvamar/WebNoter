package com.webNoter.Entity;


import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "NotesData")
public class NotesData {

    @Id
    private ObjectId id;

    private String Link;

    private String heading;

    private String description;

    private Date date;

    private String subFolderId;
}
