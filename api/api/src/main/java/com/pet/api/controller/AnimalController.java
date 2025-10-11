package com.pet.api.controller;

import com.pet.api.dto.animal.AnimalRequestDTO;
import com.pet.api.dto.animal.AnimalResponseDTO;
import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;
import com.pet.api.model.Usuario;
import com.pet.api.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import necessário
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/animais")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping
    public ResponseEntity<Animal> cadastrar(@RequestBody @Valid AnimalRequestDTO dto, UriComponentsBuilder uriBuilder) {
        Animal novoAnimal = animalService.cadastrarAnimal(dto);
        URI uri = uriBuilder.path("/animais/{id}").buildAndExpand(novoAnimal.getId()).toUri();
        return ResponseEntity.created(uri).body(novoAnimal);
    }

    @PatchMapping("/{id}/adotar")
    public ResponseEntity<Animal> adotar(@PathVariable Long id, Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        Animal animalAdotado = animalService.adotarAnimal(id, usuarioLogado.getId());
        return ResponseEntity.ok(animalAdotado);
    }

    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> listar(@RequestParam(required = false) StatusAnimal status) {
        List<Animal> animais = animalService.listarAnimais(status);
        List<AnimalResponseDTO> dtos = animais.stream()
                .map(AnimalResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> detalhar(@PathVariable Long id) {
        Animal animalEncontrado = animalService.buscarPorId(id);
        return ResponseEntity.ok(new AnimalResponseDTO(animalEncontrado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid AnimalRequestDTO dto) {
        Animal animalAtualizado = animalService.atualizarAnimal(id, dto);
        return ResponseEntity.ok(new AnimalResponseDTO(animalAtualizado));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        animalService.deletarAnimal(id);
    }

   
    @PatchMapping("/{id}/imagem")
    public ResponseEntity<AnimalResponseDTO> uploadImagem(@PathVariable Long id, @RequestParam("imagem") MultipartFile imagem) {
        Animal animalAtualizado = animalService.salvarImagem(id, imagem);
        return ResponseEntity.ok(new AnimalResponseDTO(animalAtualizado));
    }
}