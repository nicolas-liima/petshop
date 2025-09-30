package com.pet.api.controller;

import com.pet.api.dto.pedido.PedidoRequestDTO;
import com.pet.api.dto.pedido.PedidoResponseDTO;
import com.pet.api.service.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody PedidoRequestDTO pedidoRequest) {
        PedidoResponseDTO pedidoResponse = pedidoService.criarVenda(pedidoRequest);
        return new ResponseEntity<>(pedidoResponse, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id){
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
