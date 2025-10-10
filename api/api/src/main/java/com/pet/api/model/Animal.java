package com.pet.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "animal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column
    private Integer idade;

    @Column(nullable = false)
    private String especie;

    @Column(nullable = false)
    private String raca;

    @Column(nullable = false)
    private String cor;

    @Column(nullable = false)
    private String sexo;

    @Column(nullable = false)
    private String tamanho;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Boolean vacinado;

    @Column(nullable = false)
    private Boolean castrado;

    @Enumerated(EnumType.STRING)
    private StatusAnimal status;

    //Adoção animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario adotante;

    @Column(name = "url_imagem")
    private String urlImagem;
}
