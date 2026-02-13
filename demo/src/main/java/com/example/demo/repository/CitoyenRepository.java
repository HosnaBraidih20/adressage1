package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Citoyen;

@Repository
public interface CitoyenRepository extends JpaRepository<Citoyen, Long> {
}