package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity 
@Data
public class Citoyen {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom_fr")
    private String nom;
    
    @Column(name = "prenom_fr")
    private String prenom;
    
    private String cin;
    private String telephone;
    private String adresse;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @ManyToOne
    @JoinColumn(name = "id_pachalik")
    private Pachalik pachalik;
    
    @ManyToOne
    @JoinColumn(name = "id_commandement")
    private Commandement commandement;
    
    @ManyToOne
    @JoinColumn(name = "id_commune")
    private Commune commune;
    
    @ManyToOne
    @JoinColumn(name = "id_quartier")
    private Quartier quartier;
    
    @ManyToOne
    @JoinColumn(name = "id_secteur")
    private Secteur secteur;
}