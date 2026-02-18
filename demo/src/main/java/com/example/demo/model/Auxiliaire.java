package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "auxiliaire")
@Data
public class Auxiliaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aux")
    private Long idAux;

    @Column(name = "id_citoyen")
    private String idCitoyen;

    @Column(name = "date_affectation")
    private LocalDateTime dateAffectation;

    private boolean active;

    private String status;

    private String nom;
    private String prenom;
    private String cin;
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "id_secteur")
    private Secteur secteur;
}