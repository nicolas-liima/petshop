package com.pet.api.controller;

import com.pet.api.dto.produto.ProdutoRequestDTO;
import com.pet.api.dto.produto.ProdutoResponseDTO;
import com.pet.api.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criarNovoProduto (@Valid @RequestBody ProdutoRequestDTO produtoRequest){
        ProdutoResponseDTO produtoNovo = produtoService.criarProduto(produtoRequest);
        return new ResponseEntity<>(produtoNovo, HttpStatus.CREATED);
    }
    @GetMapping("/meus")
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutosDoUsuario() {
        List<ProdutoResponseDTO> produtos = produtoService.listarProdutosDoUsuario();
        return ResponseEntity.ok(produtos);
    }
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(){
        return ResponseEntity.ok(produtoService.listarTodosProdutos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> listarProduto(@PathVariable Long id){
        return ResponseEntity.ok(produtoService.listarPorId(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizarProduto(@Valid @PathVariable Long id, @RequestBody ProdutoRequestDTO produtoRequest){
        return ResponseEntity.ok(produtoService.atualizarProduto(produtoRequest, id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id){
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
    


}
