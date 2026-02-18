package com.pet.api.dto.profissional;

import com.pet.api.model.Funcionario;
import lombok.Getter;

@Getter
public class ProfissionalResponseDTO {

    private Long id;
    private String nome;
    private String cargo;
    private String cpf;
    private String crmv;
    private String email;
    private Boolean ativo;

    public ProfissionalResponseDTO(Funcionario funcionario) {
        this.id = funcionario.getId();
        this.nome = funcionario.getNome();
        this.cargo = funcionario.getCargo();
        this.cpf = funcionario.getCpf();
        this.crmv = funcionario.getCrmv();
        this.email = funcionario.getEmail();
        this.ativo = funcionario.getAtivo();
    }
}
