package com.pet.api.service;


import com.pet.api.dto.produto.ProdutoRequestDTO;
import com.pet.api.dto.produto.ProdutoResponseDTO;
import com.pet.api.model.Produto;
import com.pet.api.model.StatusProduto;
import com.pet.api.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoResponseDTO> listarTodosProdutos() {
        return produtoRepository.findAll().stream().map(ProdutoResponseDTO::new).toList();
    }
    public ProdutoResponseDTO listarPorId(Long id){
        Produto produto = FindByIdOrThrow(id);
        return new ProdutoResponseDTO(produto);
    }
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO produtoRequest){

        Produto produto = new produto();
        produto.setNome(produto.getNome());
        produto.setQuantidade(produto.getQuantidade());
        produto.setPreco(produto.getPreco());
        produto.setStatusProduto(StatusProduto.DISPONIVEL);

        Produto produtoSalvo = ProdutoRepository.save();
        return new ProdutoResponseDTO(produtoSalvo);
    }
    public ProdutoResponseDTO atualizarProduto(ProdutoRequestDTO produtoRequest, Long id){
        Produto produtoAtualizar = FindByIdOrThrow(id);
        produtoAtualizar.setNome(produtoRequest.getNome());
        produtoAtualizar.setQuantidade(produtoRequest.getQuantidade());
        produtoAtualizar.setPreco(produtoRequest.getPreco());
        produtoAtualizar.setStatusProduto(ProdutoRequestDTO.getStatusProduto());

        Produto produtoAtualizado = ProdutoRepository.save(produtoAtualizar);

        return new ProdutoResponseDTO(produtoAtualizado);
    }
    public void deletarProduto(Long id){
        Produto produtoDeletar = FindByIdOrThrow(id);
        ProdutoRepository.delete(produtoDeletar);
    }

    private Produto FindByIdOrThrow(Long id){
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não foi possivel localizar o id."+ id));
    }
}
