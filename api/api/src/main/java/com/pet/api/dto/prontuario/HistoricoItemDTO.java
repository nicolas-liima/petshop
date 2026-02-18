package com.pet.api.dto.prontuario;

import com.pet.api.model.StatusAgendamento;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HistoricoItemDTO implements Comparable<HistoricoItemDTO> {

    private Long id;
    private String tipo;
    private LocalDateTime dataHora;
    private String descricao;
    private String profissional;
    private StatusAgendamento status;
    private String detalhes;

    @Override
    public int compareTo(HistoricoItemDTO other) {
        return other.dataHora.compareTo(this.dataHora);
    }
}
