package com.pet.api.dto.produto;

import com.pet.api.model.Produto;
import com.pet.api.model.StatusProduto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProdutoResponseDTO {

    private Long id;
    private String nome;
    private Float preco;
    private int quantidade;
    private StatusProduto statusProduto;

    public ProdutoResponseDTO(Produto entity){
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.preco = entity.getPreco();
        this.quantidade = entity.getQuantidade();
        this.statusProduto = entity.getStatusProduto();
    }
}
