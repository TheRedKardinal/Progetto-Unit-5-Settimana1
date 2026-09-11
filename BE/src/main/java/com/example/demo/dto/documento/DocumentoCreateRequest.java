package com.example.demo.dto.documento;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentoCreateRequest {

    @NotBlank
    private String titolo;

    @NotBlank
    private String contenuto;
}
