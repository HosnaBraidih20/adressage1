package com.example.demo.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Entity @Data
public class Quartier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_quartier;
     
    
    private String nom_quartier_ar;
    private String nom_quartier_fr;
    private String type_quartier;

    @ManyToOne
    @JoinColumn(name = "id_commune")
    private Commune commune;

    @JsonIgnore
    @OneToMany(mappedBy = "quartier")
    private List<QuartierSecteur> quartierSecteurs;
}