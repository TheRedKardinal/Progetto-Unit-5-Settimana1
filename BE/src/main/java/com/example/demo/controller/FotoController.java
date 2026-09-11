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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.foto.FotoCreateRequest;
import com.example.demo.dto.foto.FotoResponse;
import com.example.demo.dto.foto.FotoUpdateRequest;
import com.example.demo.service.FotoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pics")
@RequiredArgsConstructor
public class FotoController {

    private final FotoService fotoService;

    @PostMapping
    public ResponseEntity<List<FotoResponse>> create(@Valid @RequestBody FotoCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fotoService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<FotoResponse>> findAll() {
        return ResponseEntity.ok(fotoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FotoResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(fotoService.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<FotoResponse> update(@PathVariable UUID id, @RequestBody FotoUpdateRequest request) {
        return ResponseEntity.ok(fotoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        fotoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
