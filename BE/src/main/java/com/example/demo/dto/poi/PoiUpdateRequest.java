package com.example.demo.dto.poi;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PoiUpdateRequest {

    private String indirizzo;
    private BigDecimal latitudine;
    private BigDecimal longitudine;
}
