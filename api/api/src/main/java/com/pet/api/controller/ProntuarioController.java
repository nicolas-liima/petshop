package com.pet.api.controller;

import com.pet.api.dto.prontuario.ProntuarioResponseDTO;
import com.pet.api.service.ProntuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prontuarios")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<ProntuarioResponseDTO> obterProntuario(@PathVariable Long animalId) {
        ProntuarioResponseDTO prontuario = prontuarioService.obterProntuario(animalId);
        return ResponseEntity.ok(prontuario);
    }
}
