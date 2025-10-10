package com.pet.api.dto.animal;

import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;

// DTO para exibir animais em listas e detalhes.
public record AnimalResponseDTO(
    Long id,
    String nome,
    String especie,
    String raca,
    StatusAnimal status,
    String urlImagem
) {
    public AnimalResponseDTO(Animal animal) {
        this(
            animal.getId(),
            animal.getNome(),
            animal.getEspecie(),
            animal.getRaca(),
            animal.getStatus(),
            animal.getUrlImagem()
        );
    }
}