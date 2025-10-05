package com.pet.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity(name = "produto")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private int quantidade;

    @Enumerated(EnumType.STRING)
    private StatusProduto statusProduto;

    @PrePersist
    @PreUpdate
    public void atualizarStatus() {
        if (quantidade <= 0) {
            statusProduto = StatusProduto.INDISPONIVEL;
        } else {
            statusProduto = StatusProduto.DISPONIVEL;
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


}
