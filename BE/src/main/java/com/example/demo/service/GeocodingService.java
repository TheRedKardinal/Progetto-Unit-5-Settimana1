package com.example.demo.service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.example.demo.dto.geocoding.GeocodeResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Geocodifica indirizzi tramite Nominatim (OpenStreetMap): servizio gratuito,
 * senza chiave API né fatturazione richiesta.
 */
@Service
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=";
    private static final String USER_AGENT = "Postbook/1.0 (social network didattico)";

    private final RestClient restClient = RestClient.create();

    public GeocodeResponse geocode(String indirizzo) {
        String encoded = URLEncoder.encode(indirizzo, StandardCharsets.UTF_8);
        URI uri = URI.create(NOMINATIM_URL + encoded);

        List<NominatimResult> results;
        try {
            results = restClient.get()
                    .uri(uri)
                    .header("User-Agent", USER_AGENT)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<NominatimResult>>() {
                    });
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("Geocoding non disponibile: " + e.getStatusText());
        }

        if (results == null || results.isEmpty()) {
            throw new ResourceNotFoundException("Indirizzo non trovato: " + indirizzo);
        }

        NominatimResult first = results.get(0);
        return new GeocodeResponse(
                first.displayName(),
                new BigDecimal(first.lat()),
                new BigDecimal(first.lon()));
    }

    private record NominatimResult(String lat, String lon, @JsonProperty("display_name") String displayName) {
    }
}
