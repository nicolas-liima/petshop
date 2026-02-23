package com.pet.api.controller;

import com.pet.api.dto.profissional.ProfissionalRequestDTO;
import com.pet.api.dto.profissional.ProfissionalResponseDTO;
import com.pet.api.model.Funcionario;
import com.pet.api.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<ProfissionalResponseDTO> cadastrar(
            @RequestBody @Valid ProfissionalRequestDTO dto,
            UriComponentsBuilder uriBuilder) {
        Funcionario novoFuncionario = funcionarioService.cadastrar(dto);
        URI uri = uriBuilder.path("/funcionarios/{id}").buildAndExpand(novoFuncionario.getId()).toUri();
        return ResponseEntity.created(uri).body(new ProfissionalResponseDTO(novoFuncionario));
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalResponseDTO>> listar() {
        List<ProfissionalResponseDTO> funcionarios = funcionarioService.listarTodos()
                .stream()
                .map(ProfissionalResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(funcionarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalResponseDTO> buscarPorId(@PathVariable Long id) {
        Funcionario funcionario = funcionarioService.buscarPorId(id);
        return ResponseEntity.ok(new ProfissionalResponseDTO(funcionario));
    }
}
