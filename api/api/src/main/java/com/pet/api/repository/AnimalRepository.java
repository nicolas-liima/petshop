package com.pet.api.repository;

import com.pet.api.model.Animal;
import com.pet.api.model.StatusAnimal;

import scala.collection.immutable.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> { 
    List<Animal> findAllByStatus(StatusAnimal status);
}
