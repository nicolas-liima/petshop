package com.pet.api.dto.animal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AnimalRequestDTO {

    @NotBlank(message = "O nome do pet não pode estar em branco.")
    private String nome;

    @NotNull(message = "A idade do pet é obrigatória.")
    @PositiveOrZero(message = "A idade do pet deve ser um número positivo.")
    private Integer idade;

    @NotBlank(message = "A espécie do pet não pode estar em branco.")
    private String especie;

    @NotBlank(message = "A raça do pet não pode estar em branco.")
    private String raca;

    @NotBlank(message = "A cor do pet não pode estar em branco.")
    private String cor;

    @NotBlank(message = "O sexo do pet não pode estar em branco.")
    private String sexo;

    @NotBlank(message = "O tamanho do pet não pode estar em branco.")
    private String tamanho;

    @NotBlank(message = "A descrição do pet não pode estar em branco.")
    private String descricao;


}