package com.example.demo.dto.post;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequest {

    @NotBlank
    private String titolo;

    @NotBlank
    private String descrizione;

    private List<UUID> idFoto;

    private UUID idPoi;
}
