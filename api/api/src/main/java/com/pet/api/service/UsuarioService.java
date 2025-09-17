package com.pet.api.service;

import com.pet.api.dto.login.LoginRequestDTO;
import com.pet.api.dto.usuario.UsuarioRequestDTO;
import com.pet.api.dto.usuario.UsuarioResponseDTO;
import com.pet.api.exception.EmailAlreadyExistsException;
import com.pet.api.exception.ResourceNotFoundException;
import com.pet.api.model.Usuario;
import com.pet.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        return usuarioRepository.findAll().stream().map(UsuarioResponseDTO::new).toList();
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        Usuario usuario = findByIdOrThrow(id);
        return new UsuarioResponseDTO(usuario);
    }

    public UsuarioResponseDTO buscarUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o email " + email));
        return new UsuarioResponseDTO(usuario);
    }

    public UsuarioResponseDTO salvarUsuario(UsuarioRequestDTO usuarioRequest) {
        if (usuarioRepository.findByEmail(usuarioRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("O email '" + usuarioRequest.getEmail() + "' já está em uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.getNome());
        usuario.setEmail(usuarioRequest.getEmail());

        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());
        usuario.setSenha(senhaCriptografada);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(usuarioSalvo);
    }

    public UsuarioResponseDTO atualizarUsuario(Long id, UsuarioRequestDTO usuarioRequest) {
        Usuario usuarioParaAtualizar = findByIdOrThrow(id);
        usuarioParaAtualizar.setNome(usuarioRequest.getNome());
        usuarioParaAtualizar.setEmail(usuarioRequest.getEmail());

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioParaAtualizar);
        return new UsuarioResponseDTO(usuarioAtualizado);
    }

    public void deletarUsuario(Long id) {
        findByIdOrThrow(id);
        usuarioRepository.deleteById(id);
    }

    public UsuarioResponseDTO verificarLogin(LoginRequestDTO login) {
        Usuario usuario = usuarioRepository.findByEmail(login.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(login.getSenha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        return new UsuarioResponseDTO(usuario);
    }

    private Usuario findByIdOrThrow(Long id) {
        return  usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o ID " + id));
    }
}
