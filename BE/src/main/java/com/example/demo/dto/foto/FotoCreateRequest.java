package com.example.demo.dto.foto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FotoCreateRequest {

    @NotEmpty
    private List<String> contenuto;
}
