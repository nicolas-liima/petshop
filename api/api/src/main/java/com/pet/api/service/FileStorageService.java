package com.pet.api.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // 1. Injeta o caminho do diretório que configuramos no application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    // 2. Este método roda assim que a aplicação inicia
    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir);
        try {
            // Cria o diretório se ele não existir
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de upload!", e);
        }
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Falha ao armazenar arquivo vazio.");
        }
        
        // 3. Limpa o nome do arquivo e gera um nome único para evitar conflitos
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        try {
            // Pega a extensão do arquivo (ex: .jpg, .png)
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } catch(Exception e) {
            fileExtension = "";
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try (InputStream inputStream = file.getInputStream()) {
            Path targetLocation = this.uploadPath.resolve(fileName);
            // 4. Copia o arquivo recebido para o nosso diretório de uploads
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName; // Retorna o novo nome único do arquivo
        } catch (IOException e) {
            throw new RuntimeException("Falha ao armazenar o arquivo " + fileName, e);
        }
    }
}