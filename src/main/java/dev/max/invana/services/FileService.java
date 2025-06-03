package dev.max.invana.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileService {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public String saveAvatarFile(MultipartFile file) {
        if(file == null || file.isEmpty()) return null;

        try {
            Path directory = Paths.get(uploadDir);
            if(!Files.exists(directory)) Files.createDirectory(directory);

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String newFilename = UUID.randomUUID() + extension;
            Path destinationFile = directory.resolve(newFilename);
            file.transferTo(destinationFile.toFile());

            return newFilename;
        } catch (IOException e){
            log.error("Failed to save avatar file", e);
            return null;
        }
    }

    public String getAvatarFileContentType(String filename) {
        try {
             Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists() && resource.isReadable()) {
                return Files.probeContentType(filePath);
            }
        } catch (IOException e) {
            log.error("Failed to get avatar file", e);
        }
        return null;
    }

    public Resource getAvatarFile(String filename) {
        try {
             Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists() && resource.isReadable()) {
                return resource;
            }
        } catch (IOException e) {
            log.error("Failed to get avatar file", e);
        }
        return null;
    }

}
