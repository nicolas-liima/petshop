package com.pet.api.controller;

import com.pet.api.dto.agendamento.AgendamentoBanhoTosaRequestDTO;
import com.pet.api.dto.agendamento.AgendamentoBanhoTosaResponseDTO;
import com.pet.api.model.AgendamentoBanhoTosa;
import com.pet.api.service.AgendamentoBanhoTosaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/agendamentos/banho-tosa")
public class AgendamentoBanhoTosaController {

    @Autowired
    private AgendamentoBanhoTosaService agendamentoService;

    @PostMapping
    public ResponseEntity<AgendamentoBanhoTosaResponseDTO> agendar(
            @RequestBody @Valid AgendamentoBanhoTosaRequestDTO dto,
            UriComponentsBuilder uriBuilder) {
        AgendamentoBanhoTosa agendamento = agendamentoService.agendar(dto);
        URI uri = uriBuilder.path("/agendamentos/banho-tosa/{id}").buildAndExpand(agendamento.getId()).toUri();
        return ResponseEntity.created(uri).body(new AgendamentoBanhoTosaResponseDTO(agendamento));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoBanhoTosaResponseDTO>> listarTodos() {
        List<AgendamentoBanhoTosaResponseDTO> agendamentos = agendamentoService.listarTodos()
                .stream()
                .map(AgendamentoBanhoTosaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoBanhoTosaResponseDTO> buscarPorId(@PathVariable Long id) {
        AgendamentoBanhoTosa agendamento = agendamentoService.buscarPorId(id);
        return ResponseEntity.ok(new AgendamentoBanhoTosaResponseDTO(agendamento));
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<AgendamentoBanhoTosaResponseDTO>> listarPorAnimal(@PathVariable Long animalId) {
        List<AgendamentoBanhoTosaResponseDTO> agendamentos = agendamentoService.listarPorAnimal(animalId)
                .stream()
                .map(AgendamentoBanhoTosaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoBanhoTosaResponseDTO> cancelar(@PathVariable Long id) {
        AgendamentoBanhoTosa agendamento = agendamentoService.cancelar(id);
        return ResponseEntity.ok(new AgendamentoBanhoTosaResponseDTO(agendamento));
    }
}
