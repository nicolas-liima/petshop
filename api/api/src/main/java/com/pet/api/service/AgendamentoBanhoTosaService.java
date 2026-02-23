package com.pet.api.service;

import com.pet.api.dto.agendamento.AgendamentoBanhoTosaRequestDTO;
import com.pet.api.exception.BusinessException;
import com.pet.api.exception.ConflictException;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.*;
import com.pet.api.repository.AgendamentoBanhoTosaRepository;
import com.pet.api.repository.AnimalRepository;
import com.pet.api.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgendamentoBanhoTosaService {

    @Autowired
    private AgendamentoBanhoTosaRepository agendamentoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    private int estimarDuracao(TipoServico tipoServico) {
        return switch (tipoServico) {
            case BANHO -> 60;
            case TOSA -> 45;
            case BANHO_E_TOSA -> 90;
        };
    }

    @Transactional
    public AgendamentoBanhoTosa agendar(AgendamentoBanhoTosaRequestDTO dto) {
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + dto.getAnimalId()));

        Funcionario funcionario = funcionarioRepository.findById(dto.getFuncionarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario nao encontrado com o id: " + dto.getFuncionarioId()));

        if (!funcionario.getAtivo()) {
            throw new BusinessException("O funcionario '" + funcionario.getNome() + "' nao esta ativo.");
        }

        if (dto.getDataHora().isBefore(LocalDateTime.now())) {
            throw new BusinessException("A data e hora do agendamento devem ser futuras. Data informada: " + dto.getDataHora());
        }

        int duracaoMinutos = estimarDuracao(dto.getTipoServico());
        LocalDateTime inicioNovo = dto.getDataHora();
        LocalDateTime fimNovo = inicioNovo.plusMinutes(duracaoMinutos);

        List<AgendamentoBanhoTosa> agendamentosExistentes = agendamentoRepository
                .findAllByFuncionarioIdAndStatus(dto.getFuncionarioId(), StatusAgendamento.AGENDADO);

        for (AgendamentoBanhoTosa existente : agendamentosExistentes) {
            LocalDateTime inicioExistente = existente.getDataHora();
            LocalDateTime fimExistente = inicioExistente.plusMinutes(existente.getDuracaoEstimadaMinutos());

            boolean conflito = inicioNovo.isBefore(fimExistente) && fimNovo.isAfter(inicioExistente);

            if (conflito) {
                throw new ConflictException("Conflito de horario: o funcionario '" + funcionario.getNome()
                        + "' ja possui um agendamento entre " + inicioExistente + " e " + fimExistente
                        + ". Escolha outro horario ou funcionario.");
            }
        }

        AgendamentoBanhoTosa agendamento = new AgendamentoBanhoTosa();
        agendamento.setAnimal(animal);
        agendamento.setFuncionario(funcionario);
        agendamento.setDataHora(dto.getDataHora());
        agendamento.setTipoServico(dto.getTipoServico());
        agendamento.setDuracaoEstimadaMinutos(duracaoMinutos);
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        return agendamentoRepository.save(agendamento);
    }

    public List<AgendamentoBanhoTosa> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public AgendamentoBanhoTosa buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento de banho/tosa nao encontrado com o id: " + id));
    }

    public List<AgendamentoBanhoTosa> listarPorAnimal(Long animalId) {
        animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + animalId));
        return agendamentoRepository.findAllByAnimalId(animalId);
    }

    @Transactional
    public AgendamentoBanhoTosa cancelar(Long id) {
        AgendamentoBanhoTosa agendamento = buscarPorId(id);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Este agendamento ja foi cancelado.");
        }

        if (agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new BusinessException("Nao e possivel cancelar um agendamento ja realizado.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        return agendamentoRepository.save(agendamento);
    }
}
