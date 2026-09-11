package com.example.demo.service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.example.demo.dto.geocoding.GeocodeResponse;
import com.example.demo.exception.ResourceNotFoundException;

/**
 * Geocodifica indirizzi tramite Geocoding API v4 di Google (server-to-server:
 * la chiave viaggia nell'header X-Goog-Api-Key, mai esposta al browser).
 */
@Service
public class GeocodingService {

    private static final String GEOCODE_URL = "https://geocode.googleapis.com/v4/geocode/address/";

    private final RestClient restClient = RestClient.create();
    private final String apiKey;

    public GeocodingService(@Value("${google.maps.api-key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public GeocodeResponse geocode(String indirizzo) {
        String encoded = URLEncoder.encode(indirizzo, StandardCharsets.UTF_8).replace("+", "%20");
        // URI.create() non ri-codifica una stringa già percent-encoded: passare la
        // stringa direttamente a .uri(String) farebbe invece un doppio encoding
        // (es. "%20" -> "%2520"), facendo fallire silenziosamente la ricerca lato Google.
        URI uri = URI.create(GEOCODE_URL + encoded);

        ApiResponse response;
        try {
            response = restClient.get()
                    .uri(uri)
                    .header("X-Goog-Api-Key", apiKey)
                    .retrieve()
                    .body(ApiResponse.class);
        } catch (RestClientResponseException e) {
            throw new IllegalStateException(
                    "Geocoding non disponibile (verifica billing e Geocoding API abilitati sul progetto Google Cloud): "
                            + e.getStatusText());
        }

        if (response == null || response.results() == null || response.results().isEmpty()) {
            throw new ResourceNotFoundException("Indirizzo non trovato: " + indirizzo);
        }

        ApiResult first = response.results().get(0);
        return new GeocodeResponse(
                first.formattedAddress(),
                BigDecimal.valueOf(first.location().latitude()),
                BigDecimal.valueOf(first.location().longitude()));
    }

    private record ApiResponse(List<ApiResult> results) {
    }

    private record ApiResult(String formattedAddress, ApiLatLng location) {
    }

    private record ApiLatLng(double latitude, double longitude) {
    }
}
