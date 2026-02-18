package com.pet.api.dto.prontuario;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProntuarioResponseDTO {

    private Long animalId;
    private String animalNome;
    private String especie;
    private String raca;
    private List<HistoricoItemDTO> historico;
}
