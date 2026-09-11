package com.example.demo.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.documento.DocumentoCreateRequest;
import com.example.demo.dto.documento.DocumentoResponse;
import com.example.demo.dto.documento.DocumentoUpdateRequest;
import com.example.demo.entities.Documento;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DocumentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final OcrService ocrService;

    @Transactional
    public DocumentoResponse create(DocumentoCreateRequest request) {
        String testoEstratto = ocrService.estraiTesto(request.getContenuto());

        Documento documento = new Documento();
        documento.setTitolo(request.getTitolo());
        documento.setContenuto(request.getContenuto());
        documento.setTesto(testoEstratto);
        documento.setCreatedAt(Instant.now());

        return toResponse(documentoRepository.save(documento));
    }

    public List<DocumentoResponse> findAll(String titolo) {
        List<Documento> documenti = (titolo == null || titolo.isBlank())
                ? documentoRepository.findAll()
                : documentoRepository.findByTitoloContainingIgnoreCase(titolo);

        return documenti.stream().map(this::toResponse).toList();
    }

    public DocumentoResponse findById(UUID id) {
        return toResponse(getDocumentoOrThrow(id));
    }

    @Transactional
    public DocumentoResponse update(UUID id, DocumentoUpdateRequest request) {
        Documento documento = getDocumentoOrThrow(id);

        if (request.getTitolo() != null) {
            documento.setTitolo(request.getTitolo());
        }
        if (request.getTesto() != null) {
            documento.setTesto(request.getTesto());
        }

        return toResponse(documentoRepository.save(documento));
    }

    @Transactional
    public void delete(UUID id) {
        Documento documento = getDocumentoOrThrow(id);
        documentoRepository.delete(documento);
    }

    private Documento getDocumentoOrThrow(UUID id) {
        return documentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documento non trovato con id " + id));
    }

    private DocumentoResponse toResponse(Documento documento) {
        DocumentoResponse response = new DocumentoResponse();
        response.setId(documento.getId());
        response.setTitolo(documento.getTitolo());
        response.setTesto(documento.getTesto());
        response.setContenuto(documento.getContenuto());
        response.setCreatedAt(documento.getCreatedAt());
        return response;
    }
}
