package com.pet.api.dto.produto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ProdutoRequestDTO {

    @NotNull
    private String nome;

    @NotNull
    private BigDecimal preco;

    @NotNull
    private Integer quantidade;
}