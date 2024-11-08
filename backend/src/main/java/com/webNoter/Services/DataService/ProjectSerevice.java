package com.webNoter.Services.DataService;


import com.webNoter.Entity.Project;
import com.webNoter.Entity.User;
import com.webNoter.Repository.ProjecRepository;
import com.webNoter.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectSerevice {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjecRepository projecRepository;

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
    public boolean projectExists(String name) {
        return projecRepository.existsByProjectName(name);
    }

    public boolean addProject(String name, String email) {
        System.out.println("addproject in service");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be empty");
        }
        if (projectExists(name)) return false;

        Project project = new Project();
        project.setProjectName(name);
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
