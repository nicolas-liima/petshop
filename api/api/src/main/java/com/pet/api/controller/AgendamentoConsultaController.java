package com.pet.api.controller;

import com.pet.api.dto.agendamento.AgendamentoConsultaRequestDTO;
import com.pet.api.dto.agendamento.AgendamentoConsultaResponseDTO;
import com.pet.api.model.AgendamentoConsulta;
import com.pet.api.service.AgendamentoConsultaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/agendamentos/consultas")
public class AgendamentoConsultaController {

    @Autowired
    private AgendamentoConsultaService agendamentoConsultaService;

    @PostMapping
    public ResponseEntity<AgendamentoConsultaResponseDTO> agendar(
            @RequestBody @Valid AgendamentoConsultaRequestDTO dto,
            UriComponentsBuilder uriBuilder) {
        AgendamentoConsulta agendamento = agendamentoConsultaService.agendar(dto);
        URI uri = uriBuilder.path("/agendamentos/consultas/{id}").buildAndExpand(agendamento.getId()).toUri();
        return ResponseEntity.created(uri).body(new AgendamentoConsultaResponseDTO(agendamento));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoConsultaResponseDTO>> listarTodos() {
        List<AgendamentoConsultaResponseDTO> agendamentos = agendamentoConsultaService.listarTodos()
                .stream()
                .map(AgendamentoConsultaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoConsultaResponseDTO> buscarPorId(@PathVariable Long id) {
        AgendamentoConsulta agendamento = agendamentoConsultaService.buscarPorId(id);
        return ResponseEntity.ok(new AgendamentoConsultaResponseDTO(agendamento));
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<AgendamentoConsultaResponseDTO>> listarPorAnimal(@PathVariable Long animalId) {
        List<AgendamentoConsultaResponseDTO> agendamentos = agendamentoConsultaService.listarPorAnimal(animalId)
                .stream()
                .map(AgendamentoConsultaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoConsultaResponseDTO> cancelar(@PathVariable Long id) {
        AgendamentoConsulta agendamento = agendamentoConsultaService.cancelar(id);
        return ResponseEntity.ok(new AgendamentoConsultaResponseDTO(agendamento));
    }
}
