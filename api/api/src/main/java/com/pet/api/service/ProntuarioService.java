package com.pet.api.service;

import com.pet.api.dto.prontuario.HistoricoItemDTO;
import com.pet.api.dto.prontuario.ProntuarioResponseDTO;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.*;
import com.pet.api.repository.AgendamentoBanhoTosaRepository;
import com.pet.api.repository.AgendamentoConsultaRepository;
import com.pet.api.repository.AgendamentoVacinaRepository;
import com.pet.api.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ProntuarioService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AgendamentoVacinaRepository agendamentoVacinaRepository;

    @Autowired
    private AgendamentoConsultaRepository agendamentoConsultaRepository;

    @Autowired
    private AgendamentoBanhoTosaRepository agendamentoBanhoTosaRepository;

    public ProntuarioResponseDTO obterProntuario(Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com o id: " + animalId));

        ProntuarioResponseDTO prontuario = new ProntuarioResponseDTO();
        prontuario.setAnimalId(animal.getId());
        prontuario.setAnimalNome(animal.getNome());
        prontuario.setEspecie(animal.getEspecie());
        prontuario.setRaca(animal.getRaca());

        List<HistoricoItemDTO> historico = new ArrayList<>();

        List<AgendamentoVacina> vacinas = agendamentoVacinaRepository.findAllByAnimalId(animalId);
        for (AgendamentoVacina av : vacinas) {
            HistoricoItemDTO item = new HistoricoItemDTO();
            item.setId(av.getId());
            item.setTipo("VACINA");
            item.setDataHora(av.getDataAgendamento().atStartOfDay());
            item.setDescricao("Vacinacao: " + av.getVacina().getNome());
            item.setProfissional(av.getVacina().getFabricante());
            item.setStatus(av.getStatus());
            item.setDetalhes(av.getObservacoes() != null ? av.getObservacoes() : "");
            historico.add(item);
        }

        List<AgendamentoConsulta> consultas = agendamentoConsultaRepository.findAllByAnimalId(animalId);
        for (AgendamentoConsulta ac : consultas) {
            HistoricoItemDTO item = new HistoricoItemDTO();
            item.setId(ac.getId());
            item.setTipo("CONSULTA");
            item.setDataHora(ac.getDataHora());
            item.setDescricao("Consulta: " + ac.getMotivo());
            item.setProfissional("Dr(a). " + ac.getVeterinario().getNome() + " (" + ac.getVeterinario().getEspecialidade() + ")");
            item.setStatus(ac.getStatus());
            item.setDetalhes("Motivo: " + ac.getMotivo());
            historico.add(item);
        }

        List<AgendamentoBanhoTosa> banhosTosas = agendamentoBanhoTosaRepository.findAllByAnimalId(animalId);
        for (AgendamentoBanhoTosa abt : banhosTosas) {
            HistoricoItemDTO item = new HistoricoItemDTO();
            item.setId(abt.getId());
            item.setTipo("BANHO_TOSA");
            item.setDataHora(abt.getDataHora());
            item.setDescricao("Servico: " + abt.getTipoServico().name());
            item.setProfissional(abt.getFuncionario().getNome());
            item.setStatus(abt.getStatus());
            item.setDetalhes("Duracao estimada: " + abt.getDuracaoEstimadaMinutos() + " minutos");
            historico.add(item);
        }

        Collections.sort(historico);

        prontuario.setHistorico(historico);
        return prontuario;
    }
}
