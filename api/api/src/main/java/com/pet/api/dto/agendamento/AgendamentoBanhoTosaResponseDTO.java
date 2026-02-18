package com.pet.api.dto.agendamento;

import com.pet.api.model.AgendamentoBanhoTosa;
import com.pet.api.model.StatusAgendamento;
import com.pet.api.model.TipoServico;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AgendamentoBanhoTosaResponseDTO {

    private Long id;
    private Long animalId;
    private String animalNome;
    private Long funcionarioId;
    private String funcionarioNome;
    private LocalDateTime dataHora;
    private TipoServico tipoServico;
    private Integer duracaoEstimadaMinutos;
    private StatusAgendamento status;

    public AgendamentoBanhoTosaResponseDTO(AgendamentoBanhoTosa agendamento) {
        this.id = agendamento.getId();
        this.animalId = agendamento.getAnimal().getId();
        this.animalNome = agendamento.getAnimal().getNome();
        this.funcionarioId = agendamento.getFuncionario().getId();
        this.funcionarioNome = agendamento.getFuncionario().getNome();
        this.dataHora = agendamento.getDataHora();
        this.tipoServico = agendamento.getTipoServico();
        this.duracaoEstimadaMinutos = agendamento.getDuracaoEstimadaMinutos();
        this.status = agendamento.getStatus();
    }
}
