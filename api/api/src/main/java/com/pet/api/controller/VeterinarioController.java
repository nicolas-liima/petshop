package com.pet.api.controller;

import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Veterinario;
import com.pet.api.repository.VeterinarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/veterinarios")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @PostMapping
    public ResponseEntity<Veterinario> cadastrar(@RequestBody @Valid Veterinario veterinario, UriComponentsBuilder uriBuilder) {
        Veterinario novoVeterinario = veterinarioRepository.save(veterinario);
        URI uri = uriBuilder.path("/veterinarios/{id}").buildAndExpand(novoVeterinario.getId()).toUri();
        return ResponseEntity.created(uri).body(novoVeterinario);
    }

    @GetMapping
    public ResponseEntity<List<Veterinario>> listar() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        Veterinario veterinario = veterinarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinario nao encontrado com o id: " + id));
        return ResponseEntity.ok(veterinario);
    }
}
