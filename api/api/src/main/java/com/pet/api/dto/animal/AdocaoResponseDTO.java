package com.pet.api.dto.animal;

import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;

// Uma outra forma de criar um response dto é o record ele ja faz todo o trampo que precisariamos fazer. Antigamente, para criar uma classe que apenas transportasse informações, como um DTO, você precisava escrever manualmente todos os campos, um construtor para inicializá-los, um método "get" para cada um, além de equals, hashCode e toString. O record elimina toda essa cerimônia.
public record AdocaoResponseDTO(
    Long idAnimal,
    String nomeAnimal,
    StatusAnimal status,
    Long idAdotante,
    String nomeAdotante
) {
   
    public AdocaoResponseDTO(Animal animal) {
        this(
            animal.getId(),
            animal.getNome(),
            animal.getStatus(),
            animal.getAdotante().getId(),
            animal.getAdotante().getNome()
        );
    }
}