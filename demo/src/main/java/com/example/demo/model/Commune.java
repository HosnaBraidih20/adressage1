package com.example.demo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity @Data
public class Commune {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommune;
    private String nom_commune_ar;
    private String nom_commune_fr;
    @ManyToOne
    @JoinColumn(name = "id_commandement")
    private Commandement commandement;
}