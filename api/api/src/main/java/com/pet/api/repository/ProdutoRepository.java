package com.pet.api.repository;

import com.pet.api.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository <Produto, Long> {
    Optional<Produto> findByNome(String nome);
}
