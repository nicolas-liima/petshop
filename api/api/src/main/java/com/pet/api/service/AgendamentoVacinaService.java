package com.pet.api.service;

import com.pet.api.dto.agendamento.AgendamentoVacinaRequestDTO;
import com.pet.api.exception.BusinessException;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.AgendamentoVacina;
import com.pet.api.model.Animal;
import com.pet.api.model.StatusAgendamento;
import com.pet.api.model.Vacina;
import com.pet.api.repository.AgendamentoVacinaRepository;
import com.pet.api.repository.AnimalRepository;
import com.pet.api.repository.VacinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AgendamentoVacinaService {

    @Autowired
    private AgendamentoVacinaRepository agendamentoVacinaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private VacinaRepository vacinaRepository;

    @Transactional
    public AgendamentoVacina agendar(AgendamentoVacinaRequestDTO dto) {
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + dto.getAnimalId()));

        Vacina vacina = vacinaRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacina nao encontrada com o id: " + dto.getVacinaId()));

        if (dto.getDataAgendamento().isBefore(LocalDate.now())) {
            throw new BusinessException("A data do agendamento deve ser uma data futura. Data informada: " + dto.getDataAgendamento());
        }

        if (dto.getDataAgendamento().isEqual(LocalDate.now())) {
            throw new BusinessException("A data do agendamento deve ser uma data futura. Nao e permitido agendar para hoje.");
        }

        if (vacina.getEstoque() <= 0) {
            throw new BusinessException("Vacina '" + vacina.getNome() + "' sem estoque disponivel.");
        }

        vacina.setEstoque(vacina.getEstoque() - 1);
        vacinaRepository.save(vacina);

        AgendamentoVacina agendamento = new AgendamentoVacina();
        agendamento.setAnimal(animal);
        agendamento.setVacina(vacina);
        agendamento.setDataAgendamento(dto.getDataAgendamento());
        agendamento.setObservacoes(dto.getObservacoes());
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        return agendamentoVacinaRepository.save(agendamento);
    }

    public List<AgendamentoVacina> listarTodos() {
        return agendamentoVacinaRepository.findAll();
    }

    public AgendamentoVacina buscarPorId(Long id) {
        return agendamentoVacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento de vacina nao encontrado com o id: " + id));
    }

    public List<AgendamentoVacina> listarPorAnimal(Long animalId) {
        animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + animalId));
        return agendamentoVacinaRepository.findAllByAnimalId(animalId);
    }
    @Transactional
    public AgendamentoVacina editar(Long id, AgendamentoVacinaRequestDTO dto) {
        AgendamentoVacina agendamento = buscarPorId(id);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Nao e possivel editar um agendamento cancelado.");
        }

        if (agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new BusinessException("Nao e possivel editar um agendamento ja realizado.");
        }

        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + dto.getAnimalId()));

        Vacina novaVacina = vacinaRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacina nao encontrada com o id: " + dto.getVacinaId()));

        if (dto.getDataAgendamento().isBefore(LocalDate.now())) {
            throw new BusinessException("A data do agendamento deve ser uma data futura. Data informada: " + dto.getDataAgendamento());
        }

        if (dto.getDataAgendamento().isEqual(LocalDate.now())) {
            throw new BusinessException("A data do agendamento deve ser uma data futura. Nao e permitido agendar para hoje.");
        }

        // Só mexe no estoque se a vacina mudou
        Vacina vacinaAtual = agendamento.getVacina();
        boolean vacinaMudou = !vacinaAtual.getId().equals(novaVacina.getId());

        if (vacinaMudou) {
            if (novaVacina.getEstoque() <= 0) {
                throw new BusinessException("Vacina '" + novaVacina.getNome() + "' sem estoque disponivel.");
            }
            // Devolve estoque da vacina antiga e decrementa a nova
            vacinaAtual.setEstoque(vacinaAtual.getEstoque() + 1);
            vacinaRepository.save(vacinaAtual);

            novaVacina.setEstoque(novaVacina.getEstoque() - 1);
            vacinaRepository.save(novaVacina);
        }

        agendamento.setAnimal(animal);
        agendamento.setVacina(novaVacina);
        agendamento.setDataAgendamento(dto.getDataAgendamento());
        agendamento.setObservacoes(dto.getObservacoes());

        return agendamentoVacinaRepository.save(agendamento);
    }

    @Transactional
    public AgendamentoVacina cancelar(Long id) {
        AgendamentoVacina agendamento = buscarPorId(id);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Este agendamento ja foi cancelado.");
        }

        if (agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new BusinessException("Nao e possivel cancelar um agendamento ja realizado.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);

        Vacina vacina = agendamento.getVacina();
        vacina.setEstoque(vacina.getEstoque() + 1);
        vacinaRepository.save(vacina);

        return agendamentoVacinaRepository.save(agendamento);
    }
}
