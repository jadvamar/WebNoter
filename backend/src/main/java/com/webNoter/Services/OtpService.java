package com.webNoter.Services;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpCache = new HashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // Generate a 6-digit OTP
        otpCache.put(email, otp);
        sendOtpEmail(email, otp);

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        return otp.equals(otpCache.getOrDefault(email, ""));
    }

    public void sendOtpEmail(String email, String otp) {
        // Validate email and OTP
        if (!StringUtils.hasText(email) || !isValidEmail(email)) {
            logger.error("Invalid email address provided: {}", email);
            throw new IllegalArgumentException("Invalid email address.");
        }

        if (!StringUtils.hasText(otp)) {
            logger.error("OTP cannot be null or empty.");
            throw new IllegalArgumentException("OTP cannot be null or empty.");
        }
        // Prepare and send the email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset OTP");
            message.setText("Your OTP for password reset for Webnoter is: " + otp);

            logger.info("Sending OTP email to: {}", email);
            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", email);

        } catch (Exception ex) {
            logger.error("Failed to send OTP email to: {}. Error: {}", email, ex.getMessage(), ex);
            throw new RuntimeException("Failed to send OTP email. Please try again later.");
        }
    }

    public void clearOtp(String email) {
        otpCache.remove(email);
    }
    private boolean isValidEmail(String email) {
        // Basic email format validation using regex
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email.matches(emailRegex);
    }

}
