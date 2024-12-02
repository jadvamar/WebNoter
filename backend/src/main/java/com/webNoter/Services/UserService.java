package com.webNoter.Services;

import com.webNoter.DTO.UserDTO;
import com.webNoter.Entity.User;
import com.webNoter.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    public String signupUser(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());

        if (existingUser.isPresent()) {
            throw new IllegalStateException("User with email " + userDTO.getEmail() + " already exists.");
        }

        User saveUser = new User();
        saveUser.setEmail(userDTO.getEmail());
        saveUser.setName(userDTO.getName());
        saveUser.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));

        userRepository.save(saveUser);
        return userDTO.getName();
    }


    public String updatePassword(String password , String email){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty())return "user not found";

        user.get().setPassword((this.passwordEncoder.encode(password)));
        userRepository.save(user.get());
        System.out.println("password updated");
        return "password updated";
    }

    public String validate(String email){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty())return "user not found";

        String otp = otpService.generateOtp(email);
        System.out.println("otp ----" + otp);
        return "otp send successfully";
    }

    public boolean verifyOTp(String email , String otp){
        return otpService.validateOtp(email,otp);
    }

    public String setPassword(String email,String password){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty())return "user not found";

        user.get().setPassword(this.passwordEncoder.encode(password));
        return "suceesfully changed";
    }
    public String getName(String email){
        Optional<User> existingUser = userRepository.findByEmail(email);
        if(existingUser.isPresent()){
            return existingUser.get().getName();
        }
        return "";
    }

    public String registerGoogleUser(String email, String name, String role) {
        // Check if the user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get().getName();
        }

        // Create a new user if they don't exist
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);

        // Save the user in the database
        userRepository.save(newUser);
        return name;
    }
}
