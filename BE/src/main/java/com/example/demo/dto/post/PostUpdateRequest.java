package com.example.demo.dto.post;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostUpdateRequest {

    private String titolo;

    private String descrizione;

    private List<UUID> idFoto;

    private UUID idPoi;
}
