package com.webNoter.DTO;

import com.webNoter.Entity.Project;
import lombok.*;

import java.util.List;

@Data
public class UserDTO {

    private String id;
    private String name;
    private String email;
    private String password;
    private List<Project> projects;
}
