package com.pet.api.controller;

import com.pet.api.dto.login.LoginRequestDTO;
import com.pet.api.dto.login.LoginResponseDTO;
import com.pet.api.model.Usuario;
import com.pet.api.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getSenha()
        );
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
