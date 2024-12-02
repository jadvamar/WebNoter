package com.webNoter.Services.DataService;

import com.webNoter.Controllers.SubFolder;
import com.webNoter.DTO.NotesDataDTO;
import com.webNoter.DTO.SubFolderDTO;
import com.webNoter.Entity.NotesData;
import com.webNoter.Entity.Project;
import com.webNoter.Entity.SubFolders;
import com.webNoter.Entity.User;
import com.webNoter.Repository.NotesDataRepository;
import com.webNoter.Repository.SubFolderRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SubFoldersService {

    @Autowired
    private SubFolderRepository subFolderRepository;
    @Autowired
    private NotesDataRepository notesDataRepository;

    public boolean subFolderExists(String name, String id) {
        return subFolderRepository.existsBySubFolderNameAndProjectId(name , id);
    }
    public boolean addSubFolder(String name, String id) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be empty");
        }
        if (subFolderExists(name,id)) return false;

        SubFolders subFolders = new SubFolders();
        subFolders.setSubFolderName(name);
        subFolders.setProjectId(id);

        subFolderRepository.save(subFolders);

        return true;
    }

    public SubFolderDTO update(SubFolderDTO subFolderDTO) {
        Optional<SubFolders> optionalSubFolder = subFolderRepository.findById(subFolderDTO.getId());

        if (optionalSubFolder.isEmpty()) {
            return null;
        }

        SubFolders subFolder = optionalSubFolder.get();
        subFolder.setSubFolderName(subFolderDTO.getSubFolderName()); // Update the subfolder name

        SubFolders updatedSubFolder = subFolderRepository.save(subFolder);

        // Convert to DTO and return
        SubFolderDTO updatedDTO = new SubFolderDTO();
        updatedDTO.setId(updatedSubFolder.getId());
        updatedDTO.setSubFolderName(updatedSubFolder.getSubFolderName());
        updatedDTO.setProjectId(updatedSubFolder.getProjectId());
        return updatedDTO;
    }

    public List<SubFolders> getSubFolders(String id) {
        List<SubFolders> response = subFolderRepository.findByprojectId(id);
        System.out.println(response);

        if (!response.isEmpty()) {
            return response;
        } else {
            // Handle user not found
            return Collections.emptyList();
        }
    }
    public String remove(String id){
        Optional<SubFolders> subFolders = subFolderRepository.findById(id);
        if(subFolders.isEmpty())return "folder is not available";

        List< NotesData> notesdata = notesDataRepository.findBysubFolderId(id);
        notesDataRepository.deleteAll(notesdata);

        subFolderRepository.delete(subFolders.get());
        return "succeess";
    }


}
