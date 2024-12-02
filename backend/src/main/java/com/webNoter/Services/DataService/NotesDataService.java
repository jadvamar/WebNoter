package com.webNoter.Services.DataService;

import com.webNoter.DTO.NotesDataDTO;
import com.webNoter.Entity.NotesData;
import com.webNoter.Entity.SubFolders;
import com.webNoter.Repository.NotesDataRepository;
import com.webNoter.Repository.SubFolderRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotesDataService {
    @Autowired
    private SubFolderRepository subFolderRepository;

    @Autowired
    private NotesDataRepository notesDataRepository;

    public boolean save(NotesDataDTO notesDataDTO) {
        String link = notesDataDTO.getLink();
        Date date = notesDataDTO.getDate();
        String headline = notesDataDTO.getHeading();
        String description = notesDataDTO.getDescription();
        String subfolderId = notesDataDTO.getSubFolderId();

        Optional<SubFolders> subFolders = subFolderRepository.findById(subfolderId);

        // Check if the subfolder exists
        if (!subFolders.isPresent()) return false;

        // Check if heading is empty, and if so, set it to a substring of the link
        if (headline == null || headline.trim().isEmpty()) {
            // Extract the domain from the link
            try {
                URL url = new URL(link);
                headline = url.getHost(); // e.g., "www.abc.com"
            } catch (MalformedURLException e) {
                e.printStackTrace();
                return false;
            }
        }

        // Create a new NotesData object and set the values
        NotesData notesData = new NotesData();
        notesData.setDate(date);
        notesData.setLink(link);
        notesData.setHeading(headline);
        notesData.setDescription(description != null ? description : ""); // Set description empty if null
        notesData.setSubFolderId(subfolderId); // Set single subfolder ID

        // Save the NotesData object to the repository
        notesDataRepository.save(notesData);
        return true;
    }

    public NotesDataDTO update(NotesDataDTO notesDataDTO) {
        try {
            // Validate ID format
            ObjectId objectId = new ObjectId(notesDataDTO.getId());

            // Fetch the note
            Optional<NotesData> optionalNote = notesDataRepository.findById(objectId);
            if (optionalNote.isEmpty()) {
                System.out.println("Note with id " + notesDataDTO.getId() + " not found.");
                return null;
            }

            // Update the note
            NotesData existingNote = optionalNote.get();
            existingNote.setHeading(notesDataDTO.getHeading());
            existingNote.setDescription(notesDataDTO.getDescription());
            existingNote.setLink(notesDataDTO.getLink());
            existingNote.setDate(notesDataDTO.getDate());

            // Save the updated note
            NotesData updatedNote = notesDataRepository.save(existingNote);

            // Return the updated DTO
            NotesDataDTO updatedDTO = new NotesDataDTO();
            updatedDTO.setId(updatedNote.getId().toHexString());
            updatedDTO.setHeading(updatedNote.getHeading());
            updatedDTO.setDescription(updatedNote.getDescription());
            updatedDTO.setLink(updatedNote.getLink());
            updatedDTO.setDate(updatedNote.getDate());
            return updatedDTO;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid ID format: " + notesDataDTO.getId() + ", Error: " + e.getMessage());
            throw e; // Rethrow to let controller handle the exception
        } catch (Exception e) {
            System.err.println("Error while updating note with id " + notesDataDTO.getId() + ": " + e.getMessage());
            throw new RuntimeException("Error updating note", e); // Throw a runtime exception for controller
        }
    }


    public List<NotesDataDTO> get(String id) {
        return notesDataRepository.findBysubFolderId(id) // Updated to single subfolder ID
                .stream()
                .map(notesData -> {
                    NotesDataDTO dto = new NotesDataDTO();
                    dto.setId(notesData.getId().toHexString().toString());
                    dto.setLink(notesData.getLink());
                    dto.setHeading(notesData.getHeading());
                    dto.setDescription(notesData.getDescription());
                    dto.setDate(notesData.getDate());
//                    dto.setSubFolderId(notesData.getSubFolderId());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public boolean remove(String id) {
        try {
            ObjectId objectId = new ObjectId(id); // Convert String to ObjectId
            Optional<NotesData> daa = notesDataRepository.findById(objectId);

            if (daa.isEmpty()) {
                System.out.println("Note with id " + id + " not found.");
                return false;
            }

            notesDataRepository.delete(daa.get());
            System.out.println("Deleted note with id: " + id);
            return true;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid ID format: " + id);
            return false;
        } catch (Exception e) {
            System.err.println("Error while deleting note with id " + id + ": " + e.getMessage());
            return false;
        }
    }


}
