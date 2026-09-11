package com.example.demo.dto.poi;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PoiCreateRequest {

    private String indirizzo;

    @NotNull
    private BigDecimal latitudine;

    @NotNull
    private BigDecimal longitudine;
}
