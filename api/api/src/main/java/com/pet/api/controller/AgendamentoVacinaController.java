package com.pet.api.controller;

import com.pet.api.dto.agendamento.AgendamentoVacinaRequestDTO;
import com.pet.api.dto.agendamento.AgendamentoVacinaResponseDTO;
import com.pet.api.model.AgendamentoVacina;
import com.pet.api.service.AgendamentoVacinaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/agendamentos/vacinas")
public class AgendamentoVacinaController {

    @Autowired
    private AgendamentoVacinaService agendamentoVacinaService;

    @PostMapping
    public ResponseEntity<AgendamentoVacinaResponseDTO> agendar(
            @RequestBody @Valid AgendamentoVacinaRequestDTO dto,
            UriComponentsBuilder uriBuilder) {
        AgendamentoVacina agendamento = agendamentoVacinaService.agendar(dto);
        URI uri = uriBuilder.path("/agendamentos/vacinas/{id}").buildAndExpand(agendamento.getId()).toUri();
        return ResponseEntity.created(uri).body(new AgendamentoVacinaResponseDTO(agendamento));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoVacinaResponseDTO>> listarTodos() {
        List<AgendamentoVacinaResponseDTO> agendamentos = agendamentoVacinaService.listarTodos()
                .stream()
                .map(AgendamentoVacinaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoVacinaResponseDTO> buscarPorId(@PathVariable Long id) {
        AgendamentoVacina agendamento = agendamentoVacinaService.buscarPorId(id);
        return ResponseEntity.ok(new AgendamentoVacinaResponseDTO(agendamento));
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<AgendamentoVacinaResponseDTO>> listarPorAnimal(@PathVariable Long animalId) {
        List<AgendamentoVacinaResponseDTO> agendamentos = agendamentoVacinaService.listarPorAnimal(animalId)
                .stream()
                .map(AgendamentoVacinaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agendamentos);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoVacinaResponseDTO> cancelar(@PathVariable Long id) {
        AgendamentoVacina agendamento = agendamentoVacinaService.cancelar(id);
        return ResponseEntity.ok(new AgendamentoVacinaResponseDTO(agendamento));
    }
}
