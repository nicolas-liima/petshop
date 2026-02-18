package com.pet.api.repository;

import com.pet.api.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByCpf(String cpf);

    Optional<Funcionario> findByCrmv(String crmv);

    Optional<Funcionario> findByEmail(String email);
}
