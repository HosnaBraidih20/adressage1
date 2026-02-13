package com.example.demo.model;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Data;

@Entity @Data
public class QuartierSecteur {
    @EmbeddedId
    private QuartierSecteurId id;
    @ManyToOne @MapsId("idQuartier") @JoinColumn(name = "id")//id_quartier
    private Quartier quartier;
    @ManyToOne @MapsId("idSecteur") @JoinColumn(name = "id_secteur")
    private Secteur secteur;
}