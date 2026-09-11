package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.documento.DocumentoCreateRequest;
import com.example.demo.dto.documento.DocumentoResponse;
import com.example.demo.dto.documento.DocumentoUpdateRequest;
import com.example.demo.service.DocumentoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping
    public ResponseEntity<DocumentoResponse> create(@Valid @RequestBody DocumentoCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentoService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<DocumentoResponse>> findAll(@RequestParam(required = false) String titolo) {
        return ResponseEntity.ok(documentoService.findAll(titolo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(documentoService.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DocumentoResponse> update(@PathVariable UUID id, @RequestBody DocumentoUpdateRequest request) {
        return ResponseEntity.ok(documentoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        documentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
