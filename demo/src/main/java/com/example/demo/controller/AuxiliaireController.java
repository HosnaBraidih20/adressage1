package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Auxiliaire;
import com.example.demo.service.AuxiliaireService;

@RestController
@RequestMapping("/api/auxiliaires")
@CrossOrigin("*")
public class AuxiliaireController {

    private final AuxiliaireService service;

    public AuxiliaireController(AuxiliaireService service) {
        this.service = service;
    }

    @GetMapping
    public List<Auxiliaire> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Auxiliaire getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // @PostMapping
    // public Auxiliaire create(@RequestBody Auxiliaire a) {
    //     return service.save(a);
    // }

    @PostMapping
    public Auxiliaire create(@RequestBody Auxiliaire a) {
        System.out.println("📡 [AUXILIAIRE CONTROLLER] POST /api/auxiliaires reçu");
        System.out.println("📥 Données reçues: " + a);
        System.out.println("  - Nom: " + a.getNom());
        System.out.println("  - Prenom: " + a.getPrenom());
        System.out.println("  - CIN: " + a.getCin());
        System.out.println("  - Telephone: " + a.getTelephone());
        System.out.println("  - idCitoyen: " + a.getIdCitoyen());
        System.out.println("  - Secteur: " + (a.getSecteur() != null ? a.getSecteur().getId() : "NULL"));
        System.out.println("  - Status: " + a.getStatus());
        System.out.println("  - Active: " + a.isActive());
        
        a.setDateAffectation(LocalDateTime.now());
        if (a.getStatus() == null) a.setStatus("ACTIF");
        
        System.out.println("📤 Enregistrement en base de données...");
        Auxiliaire saved = service.save(a);
        System.out.println("✅ Auxiliaire enregistré avec succès. ID: " + saved.getIdAux());
        
        return saved;
    }


    @PutMapping("/{id}")
    public Auxiliaire update(@PathVariable Long id, @RequestBody Auxiliaire a) {
        return service.update(id, a);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}