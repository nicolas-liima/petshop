package com.pet.api.repository;

import com.pet.api.model.Produto;
import com.pet.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository <Produto, Long> {
    List<Produto> findByUsuario(Usuario usuario);
}
