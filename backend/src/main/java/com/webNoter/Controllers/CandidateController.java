package com.webNoter.Controllers;


import com.webNoter.DTO.CandidateDTO;
import com.webNoter.DTO.SubFolderDTO;
import com.webNoter.DTO.UserDTO;
import com.webNoter.Services.DataService.CandidateEmailsService;
import com.webNoter.Services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateEmailsService candidateEmailsService;

    @Autowired
    private TokenValidationService tokenValidationService;
    @PostMapping(path = "/add")
    private ResponseEntity<?> addCandidate(@RequestBody CandidateDTO candidateDTO) {
        String loginUser = candidateDTO.getAdminEmail();
        String projectId = candidateDTO.getProjectId();
        String candidateEmail = candidateDTO.getCandidateEmail();

        try {
            if (loginUser == null || projectId == null || candidateEmail == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid request: Admin email, project ID, and candidate email are required.");
            }

            // Attempt to add candidate
            boolean added = candidateEmailsService.add(candidateEmail, loginUser, projectId);
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Candidate added successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to add candidate due to an internal error.");
            }
        } catch (IllegalArgumentException e) {
            // Handle specific errors
            if (e.getMessage().equals("Invalid email address.")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid email address.");
            } else if (e.getMessage().equals("Admin email does not match the project’s admin.")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can't add candidates. Only the admin can.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping(path = "/getEmails")
    public ResponseEntity<?> get(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String projectId
    ) {
        // Validate the token
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);

        // If token is invalid, return UNAUTHORIZED response
        if (!isValidToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        try {
            // Fetch the list of UserDTOs based on the projectId
            List<UserDTO> response = candidateEmailsService.get(projectId);

            // If no data is found, return NO_CONTENT
            if (response.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No users found for the project");
            }

            // Return the list of UserDTOs as a successful response
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PostMapping(path = "/remove")
    public ResponseEntity<?> remove(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CandidateDTO candidateDTO
    ) {
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);

        // If token is invalid, return UNAUTHORIZED response
        if (!isValidToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        try {
            // Attempt to remove the candidate
            String response = candidateEmailsService.remove(candidateDTO);

            // Check for specific response messages
            if (response.equals("No Permission")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to remove candidates from this project");
            } else if (response.equals("Not Found")) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No users found for the project");
            }
            else if(response.equals("you are admin")){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("You cant remove yourself");
            }

            // Return success response if removal was successful
            return ResponseEntity.ok("Candidate removed successfully");

        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }






}

