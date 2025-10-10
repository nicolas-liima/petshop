package com.pet.api.service;

import com.pet.api.dto.animal.AnimalRequestDTO;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;
import com.pet.api.model.Usuario;
import com.pet.api.repository.AnimalRepository;
import com.pet.api.repository.UsuarioRepository;

import scala.collection.immutable.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AnimalService {

   
    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional // Garante que o método inteiro execute como uma única transação no banco.
    public Animal adotarAnimal(Long animalId, Long usuarioId) {
        
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com o id: " + animalId));

        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o id: " + usuarioId));

        
        if (animal.getStatus() != StatusAnimal.DISPONIVEL) {
            throw new IllegalStateException("O animal não está disponível para adoção.");
        }

        
        animal.setStatus(StatusAnimal.ADOTADO);
        animal.setAdotante(usuario);

    
        return animalRepository.save(animal);


    }
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
        novoAnimal.setVacinado(dto.getVacinado());
        novoAnimal.setCastrado(dto.getCastrado());

        novoAnimal.setStatus(StatusAnimal.DISPONIVEL);

        return animalRepository.save(novoAnimal);
    }
    public List<Animal> listarAnimais(StatusAnimal status) {
    if (status == null) {
        return animalRepository.findAll(); // Retorna todos se nenhum status for passado
    }
    return animalRepository.findAllByStatus(status); // Retorna filtrado pelo status
}
}


