package com.pet.api.repository;

import com.pet.api.model.AgendamentoConsulta;
import com.pet.api.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoConsultaRepository extends JpaRepository<AgendamentoConsulta, Long> {

    List<AgendamentoConsulta> findAllByAnimalId(Long animalId);

    List<AgendamentoConsulta> findAllByVeterinarioIdAndStatus(Long veterinarioId, StatusAgendamento status);
}
