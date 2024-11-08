package com.webNoter.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class NotesDataDTO {
    private String Id;

    private String Link;

    private String heading;

    private String description;

    private Date date;
}
