package com.pet.api.service;

import com.pet.api.dto.pedido.PedidoRequestDTO;
import com.pet.api.dto.pedido.PedidoResponseDTO;
import com.pet.api.model.*;
import com.pet.api.repository.ProdutoRepository;
import com.pet.api.repository.PedidoRepository;

import com.pet.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PedidoRepository pedidoRepository;

    @Transactional
    public PedidoResponseDTO criarVenda(PedidoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + dto.getUsuarioId()));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setStatus(StatusPedido.PENDENTE);

        List<ItemPedido> itensPedido = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (PedidoRequestDTO.PedidoDTO pedidoDTO : dto.getItens()) {

            Produto produto = produtoRepository.findById(pedidoDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + pedidoDTO.getProdutoId()));


            if (produto.getStatusProduto() == StatusProduto.INDISPONIVEL) {
                throw new RuntimeException("Produto indisponível: " + produto.getNome());
            }

            if (produto.getQuantidade() < pedidoDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setProduto(produto);
            itemPedido.setPedido(pedido);
            itemPedido.setQuantidade(pedidoDTO.getQuantidade());
            itemPedido.setSubtotal(produto.getPreco().multiply(BigDecimal.valueOf(pedidoDTO.getQuantidade())));

            total = total.add(itemPedido.getSubtotal());
            itensPedido.add(itemPedido);

            produto.setQuantidade(produto.getQuantidade() - pedidoDTO.getQuantidade());

            if (produto.getQuantidade() == 0) {
                produto.setStatusProduto(StatusProduto.INDISPONIVEL);
            }

            produtoRepository.save(produto);
        }

        pedido.setItens(itensPedido);
        pedido.setTotal(total);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        PedidoResponseDTO response = new PedidoResponseDTO();
        response.setId(pedidoSalvo.getId());
        response.setTotal(total);
        response.setUsuarioNome(usuario.getNome());

        List<PedidoResponseDTO.PedidoDetalheDTO> detalheItens = new ArrayList<>();
        for (ItemPedido item : itensPedido) {
            PedidoResponseDTO.PedidoDetalheDTO detalhe = new PedidoResponseDTO.PedidoDetalheDTO();
            detalhe.setNomeProduto(item.getProduto().getNome());
            detalhe.setQuantidade(item.getQuantidade());
            detalhe.setSubtotal(item.getSubtotal());
            detalheItens.add(detalhe);
        }
        response.setItens(detalheItens);

        return response;
    }

    public void deletarPedido(Long id){
        Pedido pedidoDeletar = FindByIdOrThrow(id);
        pedidoRepository.delete(pedidoDeletar);
    }

    private Pedido FindByIdOrThrow(Long id){
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Não foi possivel localizar o id."+ id));
    }
}


