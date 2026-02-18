package com.pet.api.repository;

import com.pet.api.model.AgendamentoVacina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoVacinaRepository extends JpaRepository<AgendamentoVacina, Long> {

    List<AgendamentoVacina> findAllByAnimalId(Long animalId);
}
