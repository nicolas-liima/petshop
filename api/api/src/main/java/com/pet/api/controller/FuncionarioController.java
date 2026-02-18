package com.pet.api.controller;

import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Funcionario;
import com.pet.api.repository.FuncionarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody @Valid Funcionario funcionario, UriComponentsBuilder uriBuilder) {
        Funcionario novoFuncionario = funcionarioRepository.save(funcionario);
        URI uri = uriBuilder.path("/funcionarios/{id}").buildAndExpand(novoFuncionario.getId()).toUri();
        return ResponseEntity.created(uri).body(novoFuncionario);
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listar() {
        return ResponseEntity.ok(funcionarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario nao encontrado com o id: " + id));
        return ResponseEntity.ok(funcionario);
    }
}
