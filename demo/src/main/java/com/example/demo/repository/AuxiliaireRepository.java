package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Auxiliaire;

public interface AuxiliaireRepository extends JpaRepository<Auxiliaire, Long> {
}