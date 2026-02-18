package com.pet.api.dto.agendamento;

import com.pet.api.model.AgendamentoConsulta;
import com.pet.api.model.StatusAgendamento;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AgendamentoConsultaResponseDTO {

    private Long id;
    private Long animalId;
    private String animalNome;
    private Long veterinarioId;
    private String veterinarioNome;
    private String veterinarioEspecialidade;
    private LocalDateTime dataHora;
    private String motivo;
    private StatusAgendamento status;

    public AgendamentoConsultaResponseDTO(AgendamentoConsulta agendamento) {
        this.id = agendamento.getId();
        this.animalId = agendamento.getAnimal().getId();
        this.animalNome = agendamento.getAnimal().getNome();
        this.veterinarioId = agendamento.getVeterinario().getId();
        this.veterinarioNome = agendamento.getVeterinario().getNome();
        this.veterinarioEspecialidade = agendamento.getVeterinario().getEspecialidade();
        this.dataHora = agendamento.getDataHora();
        this.motivo = agendamento.getMotivo();
        this.status = agendamento.getStatus();
    }
}
