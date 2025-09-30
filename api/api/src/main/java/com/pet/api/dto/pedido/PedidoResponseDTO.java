package com.pet.api.dto.pedido;

import com.pet.api.model.Pedido;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PedidoResponseDTO {
    private Long id;
    private BigDecimal total;
    private String usuarioNome;
    private List<PedidoDetalheDTO> itens;

    @Data
    public static class PedidoDetalheDTO {
        private String nomeProduto;
        private Integer quantidade;
        private BigDecimal subtotal;
    }
}
