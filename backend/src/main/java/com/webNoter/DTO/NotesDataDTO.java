package com.webNoter.DTO;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class NotesDataDTO {
    private String id;

    private String link;

    private String heading;

    private String description;

    private Date date;

    private String subFolderId;
}
