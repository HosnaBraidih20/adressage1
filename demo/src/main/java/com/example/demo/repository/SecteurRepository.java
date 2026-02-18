package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Secteur;

public interface SecteurRepository extends JpaRepository<Secteur, Long> {
    
    // @Query("SELECT qs.secteur FROM QuartierSecteur qs WHERE qs.quartier.id = :quartierId")//id_quartier=
    // List<Secteur> findByQuartierId(@Param("quartierId") Long quartierId);
    @Query("SELECT qs.secteur FROM QuartierSecteur qs WHERE qs.quartier.id_quartier = :quartierId")
    List<Secteur> findByQuartierId(@Param("quartierId") Long quartierId);
}