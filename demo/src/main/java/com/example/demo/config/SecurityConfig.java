package com.example.demo.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.security.JwtAuthenticationConverterCustom;
import com.example.demo.security.JwtLoggingFilter;

/**
 * Security Configuration for OAuth2 Resource Server with Keycloak
 * Enables JWT token-based authentication and role-based access control
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
    prePostEnabled = true,
    securedEnabled = true,
    jsr250Enabled = true
)
public class SecurityConfig {

    private final JwtAuthenticationConverterCustom jwtAuthenticationConverterCustom;
    private final JwtLoggingFilter jwtLoggingFilter;

    public SecurityConfig(JwtAuthenticationConverterCustom jwtAuthenticationConverterCustom, JwtLoggingFilter jwtLoggingFilter) {
        this.jwtAuthenticationConverterCustom = jwtAuthenticationConverterCustom;
        this.jwtLoggingFilter = jwtLoggingFilter;
    }

    /**
     * Configure HTTP security
     * - OAuth2 Resource Server with JWT
     * - CORS enabled for React frontend
     * - CSRF disabled (stateless API)
     * - Session stateless (JWT-based)
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Add JWT logging filter BEFORE authentication
            .addFilterBefore(jwtLoggingFilter, BasicAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/doc", "/doc.html", "/api-docs", "/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                
                // Admin endpoints - requires ADMIN role
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")
                
                // Authenticated endpoints - any authenticated user
                .requestMatchers("/api/**").authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverterCustom)
                )
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    System.out.println("🚫 [401] Authentication failed: " + authException.getMessage());
                    response.sendError(401, "❌ Unauthorized: " + authException.getMessage());
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    System.out.println("🚫 [403] Access denied: " + accessDeniedException.getMessage());
                    response.sendError(403, "❌ Forbidden: " + accessDeniedException.getMessage());
                })
            );

        return http.build();
    }

    /**
     * Configure CORS for React frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000"
            // "http://localhost:3001",
            // "http://127.0.0.1:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
