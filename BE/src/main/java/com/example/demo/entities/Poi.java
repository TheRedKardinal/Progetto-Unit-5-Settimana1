package com.example.demo.entities;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
        name = "poi",
        indexes = {
                @Index(name = "idx_poi_latitudine", columnList = "latitudine"),
                @Index(name = "idx_poi_longitudine", columnList = "longitudine")
        }
)
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Poi {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "latitudine", nullable = false, precision = 8, scale = 6)
    private BigDecimal latitudine;

    @Column(name = "longitudine", nullable = false, precision = 9, scale = 6)
    private BigDecimal longitudine;

    @Column(name = "indirizzo", nullable = true)
    private String indirizzo;
}
