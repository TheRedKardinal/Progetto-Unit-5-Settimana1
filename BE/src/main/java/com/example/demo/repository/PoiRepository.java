package com.example.demo.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Poi;

public interface PoiRepository extends JpaRepository<Poi, UUID> {
}
