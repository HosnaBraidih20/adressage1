package com.example.demo.security;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

/**
 * Custom JWT Authentication Converter
 * Extracts roles from Keycloak realm_access.roles claim
 * Converts them to Spring Security GrantedAuthority
 */
@Component
public class JwtAuthenticationConverterCustom implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public JwtAuthenticationConverterCustom() {
        this.jwtAuthenticationConverter = new JwtAuthenticationConverter();
        // Use custom authority converter that combines realm roles and client roles
        this.jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new Converter<Jwt, Collection<GrantedAuthority>>() {
            @Override
            public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
                return extractAuthoritiesFromKeycloak(jwt);
            }
        });
        this.jwtAuthenticationConverter.setPrincipalClaimName("preferred_username");
    }

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        System.out.println("🔐 JWT Token received - Claims: " + jwt.getClaims().keySet());
        System.out.println("🔐 Username: " + jwt.getClaimAsString("preferred_username"));
        
        // Convert using the parent that now uses our custom authority converter
        AbstractAuthenticationToken authentication = this.jwtAuthenticationConverter.convert(jwt);
        
        System.out.println("🔐 Authorities: " + authentication.getAuthorities());
        System.out.println("✅ JWT Conversion successful");
        
        return authentication;
    }

    /**
     * Extract authorities from Keycloak realm_access.roles claim
     * Expected JWT structure:
     * {
     *   "realm_access": {
     *     "roles": ["user", "admin", ...]
     *   }
     * }
     */
    private Collection<GrantedAuthority> extractAuthoritiesFromKeycloak(Jwt jwt) {
        try {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");

            if (realmAccess == null || realmAccess.isEmpty()) {
                System.out.println("⚠️ No realm_access claim found in JWT");
                return Collections.emptyList();
            }

            Collection<?> roles = (Collection<?>) realmAccess.get("roles");

            if (roles == null || roles.isEmpty()) {
                System.out.println("⚠️ No roles found in realm_access");
                return Collections.emptyList();
            }

            Collection<GrantedAuthority> authorities = roles.stream()
                .map(Object::toString)
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());
            
            System.out.println("✅ Extracted roles: " + roles);
            System.out.println("✅ Converted authorities: " + authorities);
            
            return authorities;
        } catch (Exception e) {
            System.out.println("❌ Error extracting authorities: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * Extract user principal claim (username or email)
     */
    public String extractPrincipalName(Jwt jwt) {
        return jwt.getClaimAsString("preferred_username");
    }

    /**
     * Extract email from JWT
     */
    public String extractEmail(Jwt jwt) {
        return jwt.getClaimAsString("email");
    }

    /**
     * Extract full name from JWT
     */
    public String extractFullName(Jwt jwt) {
        return jwt.getClaimAsString("name");
    }

    /**
     * Extract specific claim from JWT
     */
    public Object extractClaim(Jwt jwt, String claimName) {
        return jwt.getClaim(claimName);
    }
}
