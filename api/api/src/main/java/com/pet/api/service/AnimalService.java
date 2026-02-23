package com.pet.api.service;

import com.pet.api.dto.animal.AnimalRequestDTO;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;
import com.pet.api.model.Usuario;
import com.pet.api.repository.AnimalRepository;
import com.pet.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List; // O IMPORT CORRETO ESTÁ AQUI

@Service
public class AnimalService {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Animal> listarAnimais(StatusAnimal status) {
        if (status == null) {
            return animalRepository.findAll();
        }
        return animalRepository.findAllByStatus(status);
    }

    public Animal buscarPorId(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com o id: " + id));
    }

    @Transactional
    public Animal cadastrarAnimal(AnimalRequestDTO dto) {
        Animal novoAnimal = new Animal();
        novoAnimal.setNome(dto.getNome());
        novoAnimal.setIdade(dto.getIdade());
        novoAnimal.setEspecie(dto.getEspecie());
        novoAnimal.setRaca(dto.getRaca());
        novoAnimal.setCor(dto.getCor());
        novoAnimal.setSexo(dto.getSexo());
        novoAnimal.setTamanho(dto.getTamanho());
        novoAnimal.setDescricao(dto.getDescricao());
        novoAnimal.setVacinado(false); // Valor padrão
        novoAnimal.setCastrado(false); // Valor padrão
        novoAnimal.setStatus(StatusAnimal.DISPONIVEL);
        return animalRepository.save(novoAnimal);
    }

    @Transactional
    public Animal adotarAnimal(Long animalId, Long usuarioId) {
        Animal animal = buscarPorId(animalId);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o id: " + usuarioId));

        if (animal.getStatus() != StatusAnimal.DISPONIVEL) {
            throw new IllegalStateException("O animal não está disponível para adoção.");
        }
        animal.setStatus(StatusAnimal.ADOTADO);
        animal.setAdotante(usuario);
        return animalRepository.save(animal);
    }

    @Transactional
    public Animal atualizarAnimal(Long id, AnimalRequestDTO dto) {
        Animal animal = this.buscarPorId(id);
        animal.setNome(dto.getNome());
        animal.setIdade(dto.getIdade());
        animal.setEspecie(dto.getEspecie());
        animal.setRaca(dto.getRaca());
        animal.setCor(dto.getCor());
        animal.setSexo(dto.getSexo());
        animal.setTamanho(dto.getTamanho());
        animal.setDescricao(dto.getDescricao());
        // Manter valores existentes para vacinado e castrado se não fornecidos
        if (animal.getVacinado() == null) {
            animal.setVacinado(false);
        }
        if (animal.getCastrado() == null) {
            animal.setCastrado(false);
        }
        return animal;
    }

    public List<Animal> listarPorAdotante(Long usuarioId) {
        return animalRepository.findAllByAdotanteId(usuarioId);
    }

    @Transactional
    public void deletarAnimal(Long id) {
        this.buscarPorId(id);
        animalRepository.deleteById(id);
    }

    @Transactional
    public Animal salvarImagem(Long id, MultipartFile imagem) {
        Animal animal = this.buscarPorId(id);
        String nomeArquivo = fileStorageService.store(imagem);
        String urlImagem = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/animais/")
                .path(nomeArquivo)
                .toUriString();
        animal.setUrlImagem(urlImagem);
        return animal;
    }
}