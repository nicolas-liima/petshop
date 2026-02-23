package com.pet.api.dto.agendamento;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AgendamentoVacinaRequestDTO {

    @NotNull(message = "O ID do animal e obrigatorio")
    private Long animalId;

    @NotNull(message = "O ID da vacina e obrigatorio")
    private Long vacinaId;

    @NotNull(message = "A data do agendamento e obrigatoria")
    private LocalDate dataAgendamento;

    private String observacoes;
}
