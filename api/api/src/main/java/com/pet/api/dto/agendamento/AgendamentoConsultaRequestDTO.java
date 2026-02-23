package com.pet.api.dto.agendamento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AgendamentoConsultaRequestDTO {

    @NotNull(message = "O ID do animal e obrigatorio")
    private Long animalId;

    @NotNull(message = "O ID do veterinario e obrigatorio")
    private Long veterinarioId;

    @NotNull(message = "A data e hora do agendamento e obrigatoria")
    private LocalDateTime dataHora;

    @NotBlank(message = "O motivo da consulta e obrigatorio")
    private String motivo;
}
