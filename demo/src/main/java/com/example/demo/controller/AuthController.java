package com.example.demo.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.security.JwtAuthenticationConverterCustom;

/**
 * Authentication Controller
 * Endpoints for retrieving authenticated user information
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtAuthenticationConverterCustom jwtConverter;

    public AuthController(JwtAuthenticationConverterCustom jwtConverter) {
        this.jwtConverter = jwtConverter;
    }

    /**
     * Get current authenticated user info
     * Accessible only by authenticated users
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> getCurrentUser(Principal principal, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            
            response.put("username", jwtConverter.extractPrincipalName(jwt));
            response.put("email", jwtConverter.extractEmail(jwt));
            response.put("name", jwtConverter.extractFullName(jwt));
            response.put("roles", authentication.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .toList());
            response.put("isAuthenticated", true);
        }
        
        return response;
    }

    /**
     * Logout endpoint (frontend should clear tokens)
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public Map<String, String> logout() {
        SecurityContextHolder.clearContext();
        return Map.of(
            "message", "Logged out successfully",
            "status", "success"
        );
    }

    /**
     * Check if user has admin role
     */
    @GetMapping("/is-admin")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Boolean> isAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities()
            .stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        return Map.of("isAdmin", isAdmin);
    }

    /**
     * Check token validity
     */
    @GetMapping("/validate-token")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> validateToken(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("principal", authentication.getPrincipal().toString());
        response.put("authorities", authentication.getAuthorities()
            .stream()
            .map(auth -> auth.getAuthority())
            .toList());
        return response;
    }
}
