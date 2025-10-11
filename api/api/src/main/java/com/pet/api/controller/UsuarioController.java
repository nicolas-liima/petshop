package com.pet.api.controller;

import com.pet.api.dto.animal.AnimalResponseDTO;
import com.pet.api.dto.usuario.UsuarioRequestDTO;
import com.pet.api.dto.usuario.UsuarioResponseDTO;
import com.pet.api.model.Animal;
import com.pet.api.model.Usuario;
import com.pet.api.service.AnimalService; 
import com.pet.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // INJETANDO O ANIMALSERVICE 
    @Autowired
    private AnimalService animalService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarNovoUsuario(@Valid @RequestBody UsuarioRequestDTO usuarioRequest) {
        UsuarioResponseDTO novoUsuario = usuarioService.salvarUsuario(usuarioRequest);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> buscarTodosUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodosUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorId(id));
    }

    @GetMapping("/search")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorEmail(@RequestParam("email") String email) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(@Valid @PathVariable Long id, @RequestBody UsuarioRequestDTO usuarioRequest) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, usuarioRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meus-animais")
    // --- CORREÇÃO 2: TIPO DO PARÂMETRO CORRIGIDO ---
    public ResponseEntity<List<AnimalResponseDTO>> listarMinhasAdocoes(Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        List<Animal> animaisAdotados = animalService.listarPorAdotante(usuarioLogado.getId());
        List<AnimalResponseDTO> dtos = animaisAdotados.stream()
               .map(AnimalResponseDTO::new)
               .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}