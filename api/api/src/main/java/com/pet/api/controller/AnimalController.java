package com.pet.api.controller;

import com.pet.api.dto.animal.AnimalRequestDTO;
import com.pet.api.dto.animal.AnimalResponseDTO;
import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;
import com.pet.api.model.Usuario;
import com.pet.api.service.AnimalService;

import jakarta.validation.Valid;
import scala.collection.immutable.List;

import java.net.URI;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController 
@RequestMapping("/animais") //Rota pae
public class AnimalController {

    @Autowired
    private AnimalService animalService;


    @PatchMapping("/{id}/adotar")
    public ResponseEntity<Animal> adotar(@PathVariable Long id, Authentication authentication) {
        
        
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        // Da um salve no service pro controller seguir a lei
        Animal animalAdotado = animalService.adotarAnimal(id, usuarioLogado.getId());
        
        // Da um salve em nois falando se ta tudo ok ou não mas do jeito dele (HTTP)
        return ResponseEntity.ok(animalAdotado);
    }


      @PostMapping
    public ResponseEntity<Animal> cadastrar(@RequestBody @Valid AnimalRequestDTO dto, UriComponentsBuilder uriBuilder) {
        // 1. Chama o serviço para salvar o novo animal no banco
        Animal novoAnimal = animalService.cadastrarAnimal(dto);

        // 2. Cria a URI de localização do novo recurso criado
        URI uri = uriBuilder.path("/animais/{id}").buildAndExpand(novoAnimal.getId()).toUri();

        // 3. Retorna a resposta HTTP 201 Created com a URI e o objeto no corpo
        return ResponseEntity.created(uri).body(novoAnimal);
    }
     
        @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> listar(@RequestParam(required = false) StatusAnimal status) {
        // 1. Chama o serviço para buscar os animais (com ou sem filtro)
        List<Animal> animais = animalService.listarAnimais(status);

        // 2. Converte a lista de Entidades para uma lista de DTOs
        List<AnimalResponseDTO> dtos = animais.stream()
                                              .map(AnimalResponseDTO::new)
                                              .collect(Collectors.toList());

        // 3. Retorna a resposta HTTP 200 OK com a lista de DTOs
        return ResponseEntity.ok(dtos);
    }
}