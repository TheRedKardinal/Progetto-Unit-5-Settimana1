package com.example.demo.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Foto;

public interface FotoRepository extends JpaRepository<Foto, UUID> {

    List<Foto> findAllByPostId(UUID postId);
}
