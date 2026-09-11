package com.example.demo.entities;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "documento")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "titolo", nullable = false)
    private String titolo;

    @Column(name = "testo", columnDefinition = "TEXT")
    private String testo;

    @Column(name = "contenuto", columnDefinition = "TEXT")
    private String contenuto;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
