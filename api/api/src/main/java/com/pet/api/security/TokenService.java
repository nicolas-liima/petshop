package com.pet.api.security;

import com.pet.api.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
                .setIssuer("Minha API")
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(gerarDataExpiracao())
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validarToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    private Date gerarDataExpiracao() {
        return Date.from(Instant.now().plusSeconds(3600));
    }
}
