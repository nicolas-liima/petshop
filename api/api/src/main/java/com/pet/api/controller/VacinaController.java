package com.pet.api.controller;

import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Vacina;
import com.pet.api.repository.VacinaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/vacinas")
public class VacinaController {

    @Autowired
    private VacinaRepository vacinaRepository;

    @PostMapping
    public ResponseEntity<Vacina> cadastrar(@RequestBody @Valid Vacina vacina, UriComponentsBuilder uriBuilder) {
        Vacina novaVacina = vacinaRepository.save(vacina);
        URI uri = uriBuilder.path("/vacinas/{id}").buildAndExpand(novaVacina.getId()).toUri();
        return ResponseEntity.created(uri).body(novaVacina);
    }

    @GetMapping
    public ResponseEntity<List<Vacina>> listar() {
        return ResponseEntity.ok(vacinaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vacina> buscarPorId(@PathVariable Long id) {
        Vacina vacina = vacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacina nao encontrada com o id: " + id));
        return ResponseEntity.ok(vacina);
    }
}
