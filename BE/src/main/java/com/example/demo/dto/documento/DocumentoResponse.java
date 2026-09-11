package com.example.demo.dto.documento;

import java.time.Instant;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DocumentoResponse {

    private UUID id;
    private String titolo;
    private String testo;
    private String contenuto;
    private Instant createdAt;
}
