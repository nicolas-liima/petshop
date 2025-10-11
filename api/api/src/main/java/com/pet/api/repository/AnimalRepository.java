package com.pet.api.repository;

import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    // Encontra todos os animais filtrando pelo campo 'status'.
    List<Animal> findAllByStatus(StatusAnimal status);

    // Encontra todos os animais filtrando pelo 'id' do campo 'adotante'.
    List<Animal> findAllByAdotanteId(Long usuarioId);
}