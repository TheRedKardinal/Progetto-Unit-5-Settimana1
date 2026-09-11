package com.example.demo.dto.foto;

import java.time.Instant;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FotoResponse {

    private UUID id;
    private String contenuto;
    private Instant createdAt;
    private UUID idPost;
}
