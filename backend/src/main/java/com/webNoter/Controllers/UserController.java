package com.webNoter.Controllers;


import com.webNoter.DTO.JwtRequestDTO;
import com.webNoter.DTO.JwtResponseDTO;
import com.webNoter.DTO.UserDTO;
import com.webNoter.Entity.User;
import com.webNoter.Security.JwtHelper;
import com.webNoter.Services.TokenValidationService;
import com.webNoter.Services.UserService;
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
    @PostMapping(path = "/signup")
    public ResponseEntity<String> signupUser(@RequestBody UserDTO userDTO) {
        System.out.println("signup------------------------------------------------------------------");
        String response = userService.signupUser(userDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
