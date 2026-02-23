package com.pet.api.dto.profissional;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfissionalRequestDTO {

    @NotBlank(message = "O nome e obrigatorio")
    private String nome;

    @NotBlank(message = "O cargo e obrigatorio")
    private String cargo;

    @NotBlank(message = "O CPF e obrigatorio")
    private String cpf;

    private String crmv;

    @NotBlank(message = "O email e obrigatorio")
    @Email(message = "Email invalido")
    private String email;
}
