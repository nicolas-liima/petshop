package com.pet.api.dto.agendamento;

import com.pet.api.model.AgendamentoVacina;
import com.pet.api.model.StatusAgendamento;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class AgendamentoVacinaResponseDTO {

    private Long id;
    private Long animalId;
    private String animalNome;
    private Long vacinaId;
    private String vacinaNome;
    private LocalDate dataAgendamento;
    private String observacoes;
    private StatusAgendamento status;

    public AgendamentoVacinaResponseDTO(AgendamentoVacina agendamento) {
        this.id = agendamento.getId();
        this.animalId = agendamento.getAnimal().getId();
        this.animalNome = agendamento.getAnimal().getNome();
        this.vacinaId = agendamento.getVacina().getId();
        this.vacinaNome = agendamento.getVacina().getNome();
        this.dataAgendamento = agendamento.getDataAgendamento();
        this.observacoes = agendamento.getObservacoes();
        this.status = agendamento.getStatus();
    }
}
