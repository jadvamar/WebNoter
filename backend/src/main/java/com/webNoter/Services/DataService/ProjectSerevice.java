package com.webNoter.Services.DataService;


import com.webNoter.Entity.NotesData;
import com.webNoter.Entity.Project;
import com.webNoter.Entity.SubFolders;
import com.webNoter.Entity.User;
import com.webNoter.Repository.NotesDataRepository;
import com.webNoter.Repository.ProjecRepository;
import com.webNoter.Repository.SubFolderRepository;
import com.webNoter.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectSerevice {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjecRepository projecRepository;

    @Autowired
    private SubFolderRepository subFolderRepository;

    @Autowired
    private NotesDataRepository notesDataRepository;

    public List<Project> getProjects(String email) {
        // Fetch user by email
        Optional<User> userOpt = userRepository.findByEmail(email);


        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> projectIds = user.getProjectId();

            System.out.println("projectIds = " + projectIds);

            // Fetch projects using projectIds
            return projecRepository.findAllById(projectIds);
        } else {
            // Handle user not found
            return Collections.emptyList();
        }
    }
    public boolean projectExists(String name, String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // If the user is not found, the project does not exist for that user
        if (optionalUser.isEmpty()) return false;

        Optional<Project> optionalProject = projecRepository.findByProjectName(name);

        // If the project is not found, it does not exist
        return optionalProject.filter(project -> optionalUser.get().getProjectId().contains(project.getId())).isPresent();

        // Check if the user's project list contains the project ID
    }

    public String removeProject(String id, String email) {
        // Step 1: Verify the email belongs to the project admin
        Optional<Project> project = projecRepository.findById(id);
        System.out.println("1");
        if (project.isEmpty()) {
            return "Project does not exist";
        }
        if (!Objects.equals(project.get().getAdminEmail(), email)) {
            return "You are not authorized to delete this project";
        }
        System.out.println("2");

        String projectId = project.get().getId();

        // Step 2: Find and delete all notes associated with subfolders of this project
        List<SubFolders> subFolders = subFolderRepository.findByprojectId(projectId);
        for (SubFolders subFolder : subFolders) {
            List<NotesData> notesData = notesDataRepository.findBysubFolderId(subFolder.getId());
            for (NotesData note : notesData) {
                notesDataRepository.delete(note); // Delete each note
            }
        }
        System.out.println("3");

        // Step 3: Delete all subfolders associated with this project
        subFolderRepository.deleteAll(subFolders);
        System.out.println("4");

        // Step 4: Update all users to remove this project ID from their project list
//        userRepository.removeProjectIdFromAllUsers(projectId);  // Bulk update query
        System.out.println("5");

        // Step 5: Delete the project itself
        projecRepository.deleteById(projectId);

        return "successfully removed";
    }

    public boolean addProject(String name, String email) {
        System.out.println("addproject in service");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be empty");
        }
        if (projectExists(name,email)) return false;

        Project project = new Project();
        project.setProjectName(name);
        project.setAdminEmail(email);
        projecRepository.save(project);

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User existingUser = user.get();
            // If projectId is null, initialize it
            if (existingUser.getProjectId() == null) {
                existingUser.setProjectId(new ArrayList<>());
            }
            // Add the project ID to the user's project list
            existingUser.getProjectId().add(project.getId());
            userRepository.save(existingUser);  // Save the updated user
        }
        return true;
    }
}
