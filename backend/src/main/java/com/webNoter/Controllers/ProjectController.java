package com.webNoter.Controllers;


import com.webNoter.DTO.ProjectRequestDTO;
import com.webNoter.Entity.Project;
import com.webNoter.Services.DataService.CandidateEmailsService;
import com.webNoter.Services.DataService.ProjectSerevice;
import com.webNoter.Services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("project")
public class ProjectController {

    @Autowired
    private ProjectSerevice projectSerevice;

    @Autowired
    private CandidateEmailsService candidateEmailsService;

    @Autowired
    private TokenValidationService tokenValidationService;


    @GetMapping(path = "/getProjects")
    private ResponseEntity<?> getProjects(@RequestParam String email, @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("getProjects-------------------------");

        // Validate token
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);
        if (!isValidToken) {
            // Return unauthorized response if token is invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // If token is valid, fetch the projects
        List<Project> projects = projectSerevice.getProjects(email);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }


    @PostMapping(path = "/addProject")
    private ResponseEntity<?> addProjects(@RequestBody ProjectRequestDTO projectRequest) {
        System.out.println("addProject-------------------------");
        try {
            // Check if the project already exists
            if (projectSerevice.projectExists(projectRequest.getName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("A project with this name already exists.");
            }

            // Add project if it doesn't exist
            boolean added = projectSerevice.addProject(projectRequest.getName(), projectRequest.getEmail());
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Project added successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to add project.");
            }
        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

}
