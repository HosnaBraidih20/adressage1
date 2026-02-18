package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Auxiliaire;
import com.example.demo.repository.AuxiliaireRepository;

@Service
public class AuxiliaireServiceImpl implements AuxiliaireService {

    private final AuxiliaireRepository repo;

    public AuxiliaireServiceImpl(AuxiliaireRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Auxiliaire> findAll() {
        return repo.findAll();
    }

    @Override
    public Auxiliaire findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Auxiliaire introuvable avec id: " + id));
    }

    @Override
    public Auxiliaire save(Auxiliaire a) {
        System.out.println("📦 [AUXILIAIRE SERVICE] save() appelé");
        System.out.println("  - Nom: " + a.getNom());
        System.out.println("  - Prenom: " + a.getPrenom());
        System.out.println("  - idCitoyen: " + a.getIdCitoyen());
        System.out.println("  - Secteur ID: " + (a.getSecteur() != null ? a.getSecteur().getId() : "NULL"));
        System.out.println("  - Status: " + a.getStatus());
        
        Auxiliaire result = repo.save(a);
        System.out.println("✅ [AUXILIAIRE SERVICE] save() completed. ID: " + result.getIdAux());
        return result;
    }

    @Override
    public Auxiliaire update(Long id, Auxiliaire d) {
        Auxiliaire ex = findById(id);

        ex.setIdCitoyen(d.getIdCitoyen());
        ex.setDateAffectation(d.getDateAffectation());
        ex.setActive(d.isActive());
        ex.setStatus(d.getStatus());
        ex.setNom(d.getNom());
        ex.setPrenom(d.getPrenom());
        ex.setCin(d.getCin());
        ex.setTelephone(d.getTelephone());
        ex.setSecteur(d.getSecteur());

        return repo.save(ex);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}