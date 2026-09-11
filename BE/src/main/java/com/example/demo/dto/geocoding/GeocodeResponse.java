package com.example.demo.dto.geocoding;

import java.math.BigDecimal;

public record GeocodeResponse(String indirizzo, BigDecimal latitudine, BigDecimal longitudine) {
}
