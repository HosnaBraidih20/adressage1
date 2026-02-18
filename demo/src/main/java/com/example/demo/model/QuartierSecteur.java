package com.example.demo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;

@Entity @Data
public class QuartierSecteur {
    @Id 
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "quartier_secteur_seq")
    @SequenceGenerator(name = "quartier_secteur_seq", sequenceName = "quartier_secteur_id_seq", allocationSize = 1)
    private Long id;
    
    @ManyToOne @JoinColumn(name = "id_quartier", nullable = false)
    private Quartier quartier;
    
    @ManyToOne @JoinColumn(name = "id_secteur", nullable = false)
    private Secteur secteur;
}