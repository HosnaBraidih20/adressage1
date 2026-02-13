package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Quartier;

public interface QuartierRepository extends JpaRepository<Quartier, Long> {
    // Spring غادي يفهم بوحدو أنه خاصو يدخل لـ commune ويجيب الـ Id
    List<Quartier> findByCommune_IdCommune(Long id); 
}