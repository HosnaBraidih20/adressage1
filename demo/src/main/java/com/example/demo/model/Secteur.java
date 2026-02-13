package com.example.demo.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
@Entity @Data
public class Secteur {
    @Id 
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "secteur_seq")
    @SequenceGenerator(name = "secteur_seq", sequenceName = "secteur_id_seq", allocationSize = 1)
    private Long id;

    private String code_secteur;
    private String nom_secteur_fr;
    private String nom_secteur_ar;

    @JsonIgnore
    @OneToMany(mappedBy = "secteur")
    private List<Auxiliaire> auxiliaires;

    @JsonIgnore
    @OneToMany(mappedBy = "secteur")
    private List<QuartierSecteur> quartierSecteurs;
}