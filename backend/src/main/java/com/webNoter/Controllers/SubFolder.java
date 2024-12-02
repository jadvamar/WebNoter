package com.webNoter.Controllers;

import com.webNoter.DTO.NotesDataDTO;
import com.webNoter.DTO.SubFolderDTO;
import com.webNoter.Entity.Project;
import com.webNoter.Entity.SubFolders;
import com.webNoter.Services.DataService.SubFoldersService;
import com.webNoter.Services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/subfolder")
public class SubFolder {

    @Autowired
    private SubFoldersService subFoldersService;

    @Autowired
    private TokenValidationService tokenValidationService;

    @PostMapping(path = "/add")
    private ResponseEntity<?> addProjects(@RequestBody SubFolderDTO subFolderDTO) {
        System.out.println("add Subfolder------------------------");
        try {
            // Check if the folder already exists
            if (subFoldersService.subFolderExists(subFolderDTO.getSubFolderName(), subFolderDTO.getProjectId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Collections.singletonMap("message", "A SubFolder with this name already exists."));
            }

            // Add subfolder if it doesn't exist
            boolean added = subFoldersService.addSubFolder(subFolderDTO.getSubFolderName(), subFolderDTO.getProjectId());
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Collections.singletonMap("message", "Folder added successfully."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("message", "Failed to add folder."));
            }
        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(path = "/{projectId}")
    private ResponseEntity<?> getFolders(@PathVariable String projectId, @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("getProjects-------------------------");

        // Validate token
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);
        if (!isValidToken) {
            // Return unauthorized response if token is invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        // Fetch the subfolders based on projectId if the token is valid
        List<SubFolders> response = subFoldersService.getSubFolders(projectId);
        return ResponseEntity.ok(response);
    }
    @PostMapping(path = "/remove/{subfolderId}")
    private ResponseEntity<?> remove(@PathVariable String subfolderId, @RequestHeader("Authorization") String authorizationHeader) {
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);
        if (!isValidToken) {
            // Return unauthorized response if token is invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String response = subFoldersService.remove(subfolderId);
        if (response.equals("succeess")) {
            return ResponseEntity.ok("Folder removed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder is not available.");
        }
    }

    @PostMapping(path = "/update")
    public ResponseEntity<?> update(@RequestBody SubFolderDTO subFolderDTO) {
        try {
            SubFolderDTO updatedSubFolder = subFoldersService.update(subFolderDTO);
            if (updatedSubFolder != null) {
                return ResponseEntity.ok("Subfolder updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subfolder not found or failed to update");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while updating subfolder: " + e.getMessage());
        }
    }





}
