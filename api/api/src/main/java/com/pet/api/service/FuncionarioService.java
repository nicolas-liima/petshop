package com.pet.api.service;

import com.pet.api.dto.profissional.ProfissionalRequestDTO;
import com.pet.api.exception.BusinessException;
import com.pet.api.exception.ConflictException;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Funcionario;
import com.pet.api.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Transactional
    public Funcionario cadastrar(ProfissionalRequestDTO dto) {
        if (dto.getCargo().equalsIgnoreCase("Veterinario") && (dto.getCrmv() == null || dto.getCrmv().isBlank())) {
            throw new BusinessException("Para o cargo 'Veterinario', o numero do CRMV e obrigatorio.");
        }

        funcionarioRepository.findByCpf(dto.getCpf()).ifPresent(f -> {
            throw new ConflictException("Ja existe um profissional cadastrado com o CPF: " + dto.getCpf());
        });

        funcionarioRepository.findByEmail(dto.getEmail()).ifPresent(f -> {
            throw new ConflictException("Ja existe um profissional cadastrado com o email: " + dto.getEmail());
        });

        if (dto.getCrmv() != null && !dto.getCrmv().isBlank()) {
            funcionarioRepository.findByCrmv(dto.getCrmv()).ifPresent(f -> {
                throw new ConflictException("Ja existe um profissional cadastrado com o CRMV: " + dto.getCrmv());
            });
        }

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dto.getNome());
        funcionario.setCargo(dto.getCargo());
        funcionario.setCpf(dto.getCpf());
        funcionario.setCrmv(dto.getCrmv());
        funcionario.setEmail(dto.getEmail());
        funcionario.setAtivo(true);

        return funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario nao encontrado com o id: " + id));
    }
}
