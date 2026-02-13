package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity 
@Data
public class Commandement {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private Long id_commandement; 
    
    private String nom_commandement_ar;
    private String nom_commandement_fr;
    
    @ManyToOne
    @JoinColumn(name = "id_pachalik")
    private Pachalik pachalik;
}