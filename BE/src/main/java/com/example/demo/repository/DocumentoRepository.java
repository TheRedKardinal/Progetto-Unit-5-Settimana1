package com.example.demo.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, UUID> {

    List<Documento> findByTitoloContainingIgnoreCase(String titolo);
}
