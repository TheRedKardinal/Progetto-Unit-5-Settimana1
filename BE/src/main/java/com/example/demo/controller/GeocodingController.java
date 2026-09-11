package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.geocoding.GeocodeResponse;
import com.example.demo.service.GeocodingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
public class GeocodingController {

    private final GeocodingService geocodingService;

    @GetMapping
    public ResponseEntity<GeocodeResponse> geocode(@RequestParam String indirizzo) {
        return ResponseEntity.ok(geocodingService.geocode(indirizzo));
    }
}
