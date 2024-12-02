package com.webNoter.Services.DataService;


import com.webNoter.DTO.CandidateDTO;
import com.webNoter.DTO.UserDTO;
import com.webNoter.Entity.Project;
import com.webNoter.Entity.User;
import com.webNoter.Repository.ProjecRepository;
import com.webNoter.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CandidateEmailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjecRepository projecRepository;


    public boolean add(String candidateEmail, String adminEmail, String projectId) throws IllegalArgumentException {
        // Check if the candidate email is valid
        Optional<User> candidateOpt = userRepository.findByEmail(candidateEmail);
        if (!candidateOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid email address.");
        }

        Optional<Project> projectOpt = projecRepository.findById(projectId);
        if (!projectOpt.isPresent()) {
            throw new IllegalArgumentException("Project ID not found in the system.");
        }

        Project project = projectOpt.get();

        // Check if the provided admin email matches the project's admin email
        if (!project.getAdminEmail().equals(adminEmail)) {
            throw new IllegalArgumentException("Admin email does not match the project’s admin.");
        }

        User candidate = candidateOpt.get();

        // Check if the candidate is already assigned to the project
        if (candidate.getProjectId().contains(projectId)) {
            throw new IllegalArgumentException("Candidate is already assigned to this project.");
        }

        // Add the candidate to the project
        candidate.getProjectId().add(projectId);
        userRepository.save(candidate);

        return true;
    }

    public List<UserDTO> get(String id) {
        List<User> users = userRepository.findByprojectId(id);

        List<UserDTO> response = new ArrayList<>();

        for (User user : users) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setEmail(user.getEmail());

            response.add(userDTO);
        }

        return response;
    }

    public String remove(CandidateDTO candidateDTO) {
        Optional<User> usertoRemove = userRepository.findByEmail(candidateDTO.getCandidateEmail());
        Optional<Project> project = projecRepository.findById(candidateDTO.getProjectId());

        // Check if user or project exists
        if (usertoRemove.isEmpty() || project.isEmpty()) return "Not Found";

        if (!Objects.equals(project.get().getAdminEmail() ,candidateDTO.getAdminEmail())) {
            return "No Permission";
        }
        if(Objects.equals(project.get().getAdminEmail(),usertoRemove.get().getEmail())){
            return "you are admin";
        }

        // Check if the user has permission


        // Proceed with removal if permissions are correct
        System.out.println(usertoRemove.get().getProjectId());
        System.out.println(candidateDTO.getProjectId());
        System.out.println("-------------------");
        User user = usertoRemove.get();

        // Remove project from user's list
        user.getProjectId().remove(project.get().getId());

        // Save both updated entities
        userRepository.save(user);
        System.out.println(usertoRemove.get().getProjectId());
        return "Success";
    }
}
