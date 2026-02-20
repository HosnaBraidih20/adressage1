package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Citoyen;
import com.example.demo.repository.CitoyenRepository;
import com.example.demo.security.JwtAuthenticationConverterCustom;

/**
 * Admin Controller
 * Endpoints restricted to ADMIN role only
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CitoyenRepository citoyenRepository;
    private final JwtAuthenticationConverterCustom jwtConverter;

    public AdminController(CitoyenRepository citoyenRepository, JwtAuthenticationConverterCustom jwtConverter) {
        this.citoyenRepository = citoyenRepository;
        this.jwtConverter = jwtConverter;
    }

    /**
     * Get all citizens (admin only)
     */
    @GetMapping("/citoyens")
    public List<Citoyen> getAllCitoyens(Authentication authentication) {
        logAdminAction("Fetching all citizens", authentication);
        return citoyenRepository.findAll();
    }

    /**
     * Get statistics (admin only)
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics(Authentication authentication) {
        logAdminAction("Fetching statistics", authentication);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCitoyens", citoyenRepository.count());
        stats.put("timestamp", System.currentTimeMillis());
        stats.put("retrievedBy", extractUsername(authentication));
        
        return stats;
    }

    /**
     * Delete citizen (admin only)
     */
    @DeleteMapping("/citoyens/{id}")
    public Map<String, String> deleteCitoyen(
        @PathVariable String id,
        Authentication authentication
    ) {
        logAdminAction("Deleting citizen with ID: " + id, authentication);
        
        citoyenRepository.deleteById(Long.parseLong(id));
        
        return Map.of(
            "message", "Citizen deleted successfully",
            "id", id,
            "status", "success"
        );
    }

    /**
     * System audit log (admin only)
     */
    @GetMapping("/audit-log")
    public Map<String, Object> getAuditLog(Authentication authentication) {
        logAdminAction("Accessing audit log", authentication);
        
        Map<String, Object> auditLog = new HashMap<>();
        auditLog.put("message", "Audit log data would be retrieved from database");
        auditLog.put("accessedBy", extractUsername(authentication));
        auditLog.put("timestamp", System.currentTimeMillis());
        
        return auditLog;
    }

    /**
     * Bulk operations (admin only)
     */
    @PostMapping("/bulk-operation")
    public Map<String, Object> bulkOperation(
        @RequestBody Map<String, Object> request,
        Authentication authentication
    ) {
        logAdminAction("Performing bulk operation", authentication);
        
        Map<String, Object> response = new HashMap<>();
        response.put("operation", request.get("operation"));
        response.put("performedBy", extractUsername(authentication));
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "completed");
        
        return response;
    }

    /**
     * Helper method to log admin actions
     */
    private void logAdminAction(String action, Authentication authentication) {
        String username = extractUsername(authentication);
        System.out.println("🔐 [ADMIN ACTION] User: " + username + " | Action: " + action + " | Time: " + System.currentTimeMillis());
    }

    /**
     * Helper method to extract username from JWT
     */
    private String extractUsername(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwtConverter.extractPrincipalName(jwt);
        }
        return "UNKNOWN";
    }
}
