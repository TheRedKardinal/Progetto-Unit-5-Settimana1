package com.example.demo.dto.poi;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PoiResponse {

    private UUID id;
    private String indirizzo;
    private BigDecimal latitudine;
    private BigDecimal longitudine;
}
