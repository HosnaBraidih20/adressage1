package com.example.demo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity @Data
public class Region {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_region;
    private String nom_region_ar;
    private String nom_region_fr;
}
