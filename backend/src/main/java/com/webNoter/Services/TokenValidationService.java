package com.webNoter.Services;

import com.webNoter.Security.JwtHelper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TokenValidationService {

    private static final Logger logger = LoggerFactory.getLogger(TokenValidationService.class);

    @Autowired
    private JwtHelper helper;

    @Autowired
    private UserDetailsService userDetailsService;

    public Boolean validateToken(String authorizationHeader){
        logger.info("Validating token...");

        // Check if the authorization header is present and starts with "Bearer "
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.error("Authorization header is missing or malformed");
            return false;
        }

        String token = authorizationHeader.substring(7);  // Remove "Bearer " from the token string

        try {
            // Extract username from the token
            String username = helper.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate the token against the UserDetails
            if (helper.validateToken(token, userDetails)) {
                logger.info("Token is valid for user: {}", username);
                return true; // Token is valid
            } else {
                logger.warn("Invalid token for user: {}", username);
                return false; // Token is invalid
            }
        } catch (ExpiredJwtException e) {
            logger.error("Token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token is unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Token is malformed: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Error validating token: {}", e.getMessage());
        }

        // Return false in case of any error
        return false;
    }
}
