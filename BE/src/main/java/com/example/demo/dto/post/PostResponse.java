package com.example.demo.dto.post;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostResponse {

    private UUID id;
    private String titolo;
    private String descrizione;
    private Instant createdAt;
    private UUID idPoi;
    private List<UUID> idFoto;
}
