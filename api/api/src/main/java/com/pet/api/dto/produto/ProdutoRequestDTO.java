package com.pet.api.dto.produto;

import com.pet.api.model.StatusProduto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank(message = "O nome do produto é necessario.")
    private String nome;

    @NotNull(message = "O preço não pode ser nula.")
    @Positive(message = "O preço deve ser positivo.")
    private Float preco;

    @NotNull(message = "A quantidade não pode ser nula.")
    @Positive(message = "A quantidade deve ser positiva.")
    private int quantidade;

    @NotNull(message = "Por favor defina o status do produto.")
    private StatusProduto statusProduto;
}
