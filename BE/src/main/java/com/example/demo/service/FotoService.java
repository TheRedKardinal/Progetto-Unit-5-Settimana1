package com.example.demo.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.foto.FotoCreateRequest;
import com.example.demo.dto.foto.FotoResponse;
import com.example.demo.dto.foto.FotoUpdateRequest;
import com.example.demo.entities.Foto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FotoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FotoService {

    private final FotoRepository fotoRepository;

    @Transactional
    public List<FotoResponse> create(FotoCreateRequest request) {
        List<Foto> foto = request.getContenuto().stream()
                .map(contenuto -> {
                    Foto f = new Foto();
                    f.setContenuto(contenuto);
                    f.setCreatedAt(Instant.now());
                    return f;
                })
                .toList();

        return fotoRepository.saveAll(foto).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<FotoResponse> findAll() {
        return fotoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public FotoResponse findById(UUID id) {
        return toResponse(getFotoOrThrow(id));
    }

    @Transactional
    public FotoResponse update(UUID id, FotoUpdateRequest request) {
        Foto foto = getFotoOrThrow(id);

        if (request.getContenuto() != null) {
            foto.setContenuto(request.getContenuto());
        }

        return toResponse(fotoRepository.save(foto));
    }

    @Transactional
    public void delete(UUID id) {
        Foto foto = getFotoOrThrow(id);
        fotoRepository.delete(foto);
    }

    private Foto getFotoOrThrow(UUID id) {
        return fotoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Foto non trovata con id " + id));
    }

    private FotoResponse toResponse(Foto foto) {
        FotoResponse response = new FotoResponse();
        response.setId(foto.getId());
        response.setContenuto(foto.getContenuto());
        response.setCreatedAt(foto.getCreatedAt());
        response.setIdPost(foto.getPost() != null ? foto.getPost().getId() : null);
        return response;
    }
}
