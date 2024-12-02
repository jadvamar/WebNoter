package com.webNoter.Controllers;

import com.webNoter.DTO.CandidateDTO;
import com.webNoter.DTO.NotesDataDTO;
import com.webNoter.Entity.SubFolders;
import com.webNoter.Services.DataService.NotesDataService;
import com.webNoter.Services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/data")

public class NotesDataController {

    @Autowired
    private NotesDataService notesDataService;
    @Autowired
    private TokenValidationService tokenValidationService;


    @PostMapping(path = "/add")
    private ResponseEntity<?> addCandidate(@RequestBody NotesDataDTO notesDataDTO, @RequestHeader("Authorization") String authorizationHeader) {

        System.out.println(notesDataDTO);
        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);
        if (!isValidToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\":\"Unauthorized access\"}");
        }

        boolean save = notesDataService.save(notesDataDTO);
        if (!save) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Failed to save data. Check subfolder ID.\"}");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\":\"Data saved successfully\"}");
    }
    @PostMapping(path = "/update")
    public ResponseEntity<String> update(@RequestBody NotesDataDTO notesDataDTO) {
        try {
            NotesDataDTO updatedNotesData = notesDataService.update(notesDataDTO);
            if (updatedNotesData != null && updatedNotesData.getId() != null) {
                return ResponseEntity.status(HttpStatus.OK).body("Note updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found or failed to update");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid ID format: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while updating note: " + e.getMessage());
        }
    }

    @DeleteMapping(path = "/remove/{noteId}")
    private ResponseEntity<?> remove(@PathVariable String noteId, @RequestHeader("Authorization") String authorizationHeader) {

        boolean isValidToken = tokenValidationService.validateToken(authorizationHeader);
        if (!isValidToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\":\"Unauthorized access\"}");
        }
        if (noteId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("notesId is null");
        }

        try {
            System.out.println("1" +  noteId);
            boolean ans = notesDataService.remove(noteId);
            System.out.println("2");
            if (!ans) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("error while removing data");
            }
            System.out.println("3");
            return ResponseEntity.status(HttpStatus.OK).body("removed successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }



    }

    @GetMapping(path="/{subfolderId}")
    public ResponseEntity<?> get(@PathVariable String subfolderId) {
        if (subfolderId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("subfolderId is null");
        }

        try {
            List<NotesDataDTO> ans = notesDataService.get(subfolderId);

            if (ans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No data found for the given subfolderId");
            }

            return ResponseEntity.ok(ans);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }



}
