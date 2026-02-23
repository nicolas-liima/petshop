package com.pet.api.dto.agendamento;

import com.pet.api.model.TipoServico;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AgendamentoBanhoTosaRequestDTO {

    @NotNull(message = "O ID do animal e obrigatorio")
    private Long animalId;

    @NotNull(message = "O ID do funcionario e obrigatorio")
    private Long funcionarioId;

    @NotNull(message = "A data e hora do agendamento e obrigatoria")
    private LocalDateTime dataHora;

    @NotNull(message = "O tipo de servico e obrigatorio (BANHO, TOSA, BANHO_E_TOSA)")
    private TipoServico tipoServico;
}
