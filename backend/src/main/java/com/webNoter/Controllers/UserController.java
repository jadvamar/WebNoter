package com.webNoter.Controllers;


import com.webNoter.DTO.JwtRequestDTO;
import com.webNoter.DTO.JwtResponseDTO;
import com.webNoter.DTO.PasswordDTO;
import com.webNoter.DTO.UserDTO;
import com.webNoter.Entity.User;
import com.webNoter.Security.JwtHelper;
import com.webNoter.Services.OtpService;
import com.webNoter.Services.TokenValidationService;
import com.webNoter.Services.UserService;
import org.apache.catalina.mbeans.SparseUserDatabaseMBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtHelper helper;

    @Autowired
    private TokenValidationService tokenValidationService;



    //----------------------------------------------------------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
//        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required!");
        }

        System.out.println("email ------------" + email);

        String response = userService.validate(email);
        if (Objects.equals(response, "user not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found this user.");
        }

        return ResponseEntity.status(HttpStatus.OK).body("OTP has been sent to your email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody PasswordDTO passwordDTO) {
        String email = passwordDTO.getEmail();
        String otp = passwordDTO.getOtp();

        if (email == null || email.isEmpty() || otp == null || otp.isEmpty()) {
            return ResponseEntity.badRequest().body("Email and OTP are required!");
        }

        boolean isValid = userService.verifyOTp(email, otp);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }

        return ResponseEntity.ok("OTP validated successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        System.out.println(email+" "+newPassword);

        if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and new password are required!");
        }

        String response = userService.updatePassword(newPassword, email);
        if ("user not found".equalsIgnoreCase(response)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        return ResponseEntity.ok("Password updated successfully.");
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signupUser(@RequestBody UserDTO userDTO) {
        System.out.println("signup------------------------------------------------------------------");
        try {
            String response = userService.signupUser(userDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Return a 409 Conflict response if the user already exists
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping(path = "/validateToken")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("Validating token...");

        boolean isValid = tokenValidationService.validateToken(authorizationHeader);

        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    @PostMapping(path ="/login")
    public ResponseEntity<JwtResponseDTO> loginEmployee(@RequestBody JwtRequestDTO request) {
        System.out.println("login-------------------------");
        this.doAuthenticate(request.getEmail(), request.getPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String name = userService.getName(request.getEmail());
        String token = this.helper.generateToken(userDetails);

        JwtResponseDTO response = JwtResponseDTO.builder()
                .token(token)
                .email(userDetails.getUsername())
                .name(name).build();
        System.out.println(userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password  !!");
        }

    }
}
