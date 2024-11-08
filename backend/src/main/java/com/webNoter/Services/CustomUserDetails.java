package com.webNoter.Services;

import com.webNoter.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return the authorities granted to the user (if any)
        return null; // Update with your roles or permissions if necessary
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // Assuming you use email as the username
    }

    public String getName(){
        return user.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Implement based on your logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Implement based on your logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Implement based on your logic
    }

    @Override
    public boolean isEnabled() {
        return true; // Implement based on your logic
    }

    // Add any additional methods if needed
}
