package com.example.demo.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable @Data
public class QuartierSecteurId implements Serializable {
    private Long idQuartier;
    private Long idSecteur;
}