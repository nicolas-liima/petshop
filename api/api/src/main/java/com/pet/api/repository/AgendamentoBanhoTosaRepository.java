package com.pet.api.repository;

import com.pet.api.model.AgendamentoBanhoTosa;
import com.pet.api.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoBanhoTosaRepository extends JpaRepository<AgendamentoBanhoTosa, Long> {

    List<AgendamentoBanhoTosa> findAllByAnimalId(Long animalId);

    List<AgendamentoBanhoTosa> findAllByFuncionarioIdAndStatus(Long funcionarioId, StatusAgendamento status);
}
