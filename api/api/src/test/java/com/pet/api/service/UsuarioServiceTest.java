package com.pet.api.service;

import com.pet.api.dto.usuario.UsuarioRequestDTO;
import com.pet.api.dto.usuario.UsuarioResponseDTO;
import com.pet.api.exception.EmailAlreadyExistsException;
import com.pet.api.model.Usuario;
import com.pet.api.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void quandoBuscarPorId_deveRetornarUsuario_comSucesso() {
        Usuario usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNome("Camila Teste");
        usuarioMock.setEmail("camila@teste.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));

        UsuarioResponseDTO resultado = usuarioService.buscarUsuarioPorId(1L);

        assertNotNull(resultado);
        assertEquals("Camila Teste", resultado.getNome());
        assertEquals("camila@teste.com", resultado.getEmail());

        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void quandoTentarSalvarComEmailDuplicado_deveLancarExcecao() {
        UsuarioRequestDTO usuarioRequest = new UsuarioRequestDTO();
        usuarioRequest.setNome("Camila");
        usuarioRequest.setEmail("email.existente@teste.com");
        usuarioRequest.setSenha("senhateste");

        when(usuarioRepository.findByEmail("email.existente@teste.com")).thenReturn(Optional.of(new Usuario()));

        assertThrows(EmailAlreadyExistsException.class, () -> {
            usuarioService.salvarUsuario(usuarioRequest);
        });

        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
