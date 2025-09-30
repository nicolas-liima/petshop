package com.pet.api.dto.pedido;

import lombok.Data;
import java.util.List;

@Data
public class PedidoRequestDTO {

    private Long usuarioId;
    private List<PedidoDTO> itens;

    @Data
    public static class PedidoDTO {
        private Long produtoId;
        private Integer quantidade;
    }
}
