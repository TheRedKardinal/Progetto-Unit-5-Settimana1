package com.example.demo.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.poi.PoiCreateRequest;
import com.example.demo.dto.poi.PoiResponse;
import com.example.demo.dto.poi.PoiUpdateRequest;
import com.example.demo.entities.Poi;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PoiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PoiService {

    private final PoiRepository poiRepository;

    @Transactional
    public PoiResponse create(PoiCreateRequest request) {
        Poi poi = new Poi();
        poi.setIndirizzo(request.getIndirizzo());
        poi.setLatitudine(request.getLatitudine());
        poi.setLongitudine(request.getLongitudine());

        return toResponse(poiRepository.save(poi));
    }

    public List<PoiResponse> findAll() {
        return poiRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public PoiResponse findById(UUID id) {
        return toResponse(getPoiOrThrow(id));
    }

    @Transactional
    public PoiResponse update(UUID id, PoiUpdateRequest request) {
        Poi poi = getPoiOrThrow(id);

        if (request.getIndirizzo() != null) {
            poi.setIndirizzo(request.getIndirizzo());
        }
        if (request.getLatitudine() != null) {
            poi.setLatitudine(request.getLatitudine());
        }
        if (request.getLongitudine() != null) {
            poi.setLongitudine(request.getLongitudine());
        }

        return toResponse(poiRepository.save(poi));
    }

    private Poi getPoiOrThrow(UUID id) {
        return poiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("POI non trovato con id " + id));
    }

    private PoiResponse toResponse(Poi poi) {
        PoiResponse response = new PoiResponse();
        response.setId(poi.getId());
        response.setIndirizzo(poi.getIndirizzo());
        response.setLatitudine(poi.getLatitudine());
        response.setLongitudine(poi.getLongitudine());
        return response;
    }
}
