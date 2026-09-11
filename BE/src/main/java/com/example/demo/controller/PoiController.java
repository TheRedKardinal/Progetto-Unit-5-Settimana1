package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.poi.PoiCreateRequest;
import com.example.demo.dto.poi.PoiResponse;
import com.example.demo.dto.poi.PoiUpdateRequest;
import com.example.demo.service.PoiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/poi")
@RequiredArgsConstructor
public class PoiController {

    private final PoiService poiService;

    @PostMapping
    public ResponseEntity<PoiResponse> create(@Valid @RequestBody PoiCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(poiService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<PoiResponse>> findAll() {
        return ResponseEntity.ok(poiService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PoiResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(poiService.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PoiResponse> update(@PathVariable UUID id, @RequestBody PoiUpdateRequest request) {
        return ResponseEntity.ok(poiService.update(id, request));
    }
}
