package com.example.demo.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Post;

public interface PostRepository extends JpaRepository<Post, UUID> {
}
