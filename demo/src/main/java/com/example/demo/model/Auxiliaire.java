package com.example.demo.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity @Data
public class Auxiliaire {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_aux;
    private String id_citoyen;
    private Date date_affectation;
    private boolean active;
    private String status;
    @ManyToOne
    @JoinColumn(name = "id_secteur")
    private Secteur secteur;
}