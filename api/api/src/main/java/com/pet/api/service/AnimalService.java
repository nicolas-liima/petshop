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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@Service
public class AnimalService {

    @Autowired
    private FileStorageService fileStorageService;

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
    public Animal buscarPorId(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com o id: " + id));
    }
    @Transactional
    public Animal atualizarAnimal(Long id, AnimalRequestDTO dto) {
        // 1. Busca o animal no banco (o método buscarPorId já lança exceção se não achar)
        Animal animal = this.buscarPorId(id);

        // 2. Atualiza os dados da entidade com base nas informações do DTO
        animal.setNome(dto.getNome());
        animal.setIdade(dto.getIdade());
        animal.setEspecie(dto.getEspecie());
        animal.setRaca(dto.getRaca());
        animal.setCor(dto.getCor());
        animal.setSexo(dto.getSexo());
        animal.setTamanho(dto.getTamanho());
        animal.setDescricao(dto.getDescricao());
        animal.setVacinado(dto.getVacinado());
        animal.setCastrado(dto.getCastrado());

        // 3. O @Transactional vai cuidar de salvar as alterações no banco de dados
        return animal;
    }
     public List<Animal> listarPorAdotante(Long usuarioId) {
        return animalRepository.findAllByAdotanteId(usuarioId);
    }
     @Transactional
    public void deletarAnimal(Long id) {
        // 1. Garante que o animal existe antes de deletar. Se não existir, o buscarPorId já lança uma exceção.
        this.buscarPorId(id);

        // 2. Se o animal foi encontrado, manda o comando para deletar.
        animalRepository.deleteById(id);
    }
     @Transactional
    public Animal salvarImagem(Long id, MultipartFile imagem) {
        // Busca o animal no banco (ou lança exceção se não existir)
        Animal animal = this.buscarPorId(id);
        
        // Salva o arquivo no disco e obtém o nome único gerado
        String nomeArquivo = fileStorageService.store(imagem);

        // Constrói a URL completa que será usada para acessar a imagem
        String urlImagem = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/animais/") // Este caminho será configurado no Passo 5
                .path(nomeArquivo)
                .toUriString();

        // Atualiza a entidade Animal com a URL da imagem
        animal.setUrlImagem(urlImagem);
        
        // O @Transactional cuida de salvar a entidade atualizada no banco
        return animal;
    }
}


