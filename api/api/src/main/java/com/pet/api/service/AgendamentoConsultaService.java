package com.pet.api.service;

import com.pet.api.dto.agendamento.AgendamentoConsultaRequestDTO;
import com.pet.api.exception.BusinessException;
import com.pet.api.exception.ConflictException;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.*;
import com.pet.api.repository.AgendamentoConsultaRepository;
import com.pet.api.repository.AnimalRepository;
import com.pet.api.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgendamentoConsultaService {

    private static final int DURACAO_CONSULTA_MINUTOS = 30;

    @Autowired
    private AgendamentoConsultaRepository agendamentoConsultaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Transactional
    public AgendamentoConsulta agendar(AgendamentoConsultaRequestDTO dto) {
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + dto.getAnimalId()));

        Veterinario veterinario = veterinarioRepository.findById(dto.getVeterinarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Veterinario nao encontrado com o id: " + dto.getVeterinarioId()));

        if (!veterinario.getAtivo()) {
            throw new BusinessException("O veterinario '" + veterinario.getNome() + "' nao esta ativo no momento.");
        }

        if (dto.getDataHora().isBefore(LocalDateTime.now())) {
            throw new BusinessException("A data e hora do agendamento devem ser futuras. Data informada: " + dto.getDataHora());
        }

        LocalDateTime inicioNovo = dto.getDataHora();
        LocalDateTime fimNovo = inicioNovo.plusMinutes(DURACAO_CONSULTA_MINUTOS);

        List<AgendamentoConsulta> agendamentosExistentes = agendamentoConsultaRepository
                .findAllByVeterinarioIdAndStatus(dto.getVeterinarioId(), StatusAgendamento.AGENDADO);

        for (AgendamentoConsulta existente : agendamentosExistentes) {
            LocalDateTime inicioExistente = existente.getDataHora();
            LocalDateTime fimExistente = inicioExistente.plusMinutes(DURACAO_CONSULTA_MINUTOS);

            boolean conflito = inicioNovo.isBefore(fimExistente) && fimNovo.isAfter(inicioExistente);

            if (conflito) {
                throw new ConflictException("Conflito de horario: o veterinario '" + veterinario.getNome()
                        + "' ja possui uma consulta agendada entre " + inicioExistente + " e " + fimExistente
                        + ". Escolha outro horario ou veterinario.");
            }
        }

        AgendamentoConsulta agendamento = new AgendamentoConsulta();
        agendamento.setAnimal(animal);
        agendamento.setVeterinario(veterinario);
        agendamento.setDataHora(dto.getDataHora());
        agendamento.setMotivo(dto.getMotivo());
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        return agendamentoConsultaRepository.save(agendamento);
    }

    public List<AgendamentoConsulta> listarTodos() {
        return agendamentoConsultaRepository.findAll();
    }

    public AgendamentoConsulta buscarPorId(Long id) {
        return agendamentoConsultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento de consulta nao encontrado com o id: " + id));
    }

    public List<AgendamentoConsulta> listarPorAnimal(Long animalId) {
        animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + animalId));
        return agendamentoConsultaRepository.findAllByAnimalId(animalId);
    }

    @Transactional
    public AgendamentoConsulta cancelar(Long id) {
        AgendamentoConsulta agendamento = buscarPorId(id);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Este agendamento ja foi cancelado.");
        }

        if (agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new BusinessException("Nao e possivel cancelar um agendamento ja realizado.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        return agendamentoConsultaRepository.save(agendamento);
    }
}
