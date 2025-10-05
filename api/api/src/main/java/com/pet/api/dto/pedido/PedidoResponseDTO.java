package com.pet.api.dto.pedido;

import com.pet.api.model.ItemPedido;
import com.pet.api.model.Pedido;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class PedidoResponseDTO {

    private Long id;
    private BigDecimal total;
    private String usuarioNome;
    private List<PedidoDetalheDTO> itens;

    public PedidoResponseDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.total = pedido.getTotal();
        this.usuarioNome = pedido.getUsuario().getNome();

        if (pedido.getItens() != null) {
            this.itens = pedido.getItens().stream()
                    .map(PedidoDetalheDTO::new) // ✅ Agora compila sem erro
                    .collect(Collectors.toList());
        }
    }

    @Data
    public static class PedidoDetalheDTO {
        private String nomeProduto;
        private Integer quantidade;
        private BigDecimal subtotal;

        public PedidoDetalheDTO(ItemPedido itemPedido) {
            this.nomeProduto = itemPedido.getProduto().getNome();
            this.quantidade = itemPedido.getQuantidade();
            this.subtotal = itemPedido.getSubtotal();
        }
    }
}
