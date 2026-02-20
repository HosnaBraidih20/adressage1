package com.example.demo.security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Custom filter to log JWT token validation
 * Logs all requests to help debug authentication issues
 */
@Component
public class JwtLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        if (uri.startsWith("/api")) {
            System.out.println("");
            System.out.println("════════════════════════════════════════════════════════════");
            System.out.println("[JWT VALIDATION] " + method + " " + uri);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("✅ Authorization Header: Bearer " + token.substring(0, Math.min(50, token.length())) + "...");
                System.out.println("📊 Token Length: " + token.length());
            } else {
                System.out.println("❌ NO AUTHORIZATION HEADER");
            }
            
            System.out.println("════════════════════════════════════════════════════════════");
            System.out.println("");
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (uri.startsWith("/api")) {
                System.out.println("[JWT VALIDATION RESULT] Status: " + response.getStatus());
            }
        }
    }
}
