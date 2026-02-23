package com.pet.api.dto.animal;

import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;

// DTO para exibir animais em listas e detalhes.
public record AnimalResponseDTO(
    Long id,
    String nome,
    Integer idade,
    String especie,
    String raca,
    String cor,
    String sexo,
    String tamanho,
    String descricao,

    StatusAnimal status,
    String urlImagem
) {
    public AnimalResponseDTO(Animal animal) {
        this(
            animal.getId(),
            animal.getNome(),
            animal.getIdade(),
            animal.getEspecie(),
            animal.getRaca(),
            animal.getCor(),
            animal.getSexo(),
            animal.getTamanho(),
            animal.getDescricao(),
            animal.getStatus(),
            animal.getUrlImagem()
        );
    }
}