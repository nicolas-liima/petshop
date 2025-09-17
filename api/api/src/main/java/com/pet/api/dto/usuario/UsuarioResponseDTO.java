package com.pet.api.dto.usuario;

import com.pet.api.model.Usuario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;

    public UsuarioResponseDTO(Usuario entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.email = entity.getEmail();
    }
}
