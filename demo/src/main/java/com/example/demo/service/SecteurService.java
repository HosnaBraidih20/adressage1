package com.example.demo.service;

import com.example.demo.model.Secteur;
import java.util.List;

public interface SecteurService {
    List<Secteur> findAll();
    Secteur findById(Long id);
    Secteur save(Secteur s);
    Secteur update(Long id, Secteur s);
    void delete(Long id);
    java.util.List<Secteur> findByQuartierId(Long quartierId);
}