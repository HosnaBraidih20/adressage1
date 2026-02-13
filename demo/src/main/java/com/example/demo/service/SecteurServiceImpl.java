package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Secteur;
import com.example.demo.repository.SecteurRepository;

@Service
public class SecteurServiceImpl implements SecteurService {

    private final SecteurRepository secteurRepository;

    // Constructor Injection
    public SecteurServiceImpl(SecteurRepository secteurRepository) {
        this.secteurRepository = secteurRepository;
    }

    @Override
    public List<Secteur> findAll() {
        return secteurRepository.findAll();
    }

    @Override
    public Secteur findById(Long id) {
        return secteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Secteur introuvable avec l'id : " + id));
    }

    @Override
    public Secteur save(Secteur s) {
        return secteurRepository.save(s);
    }

    @Override
    public Secteur update(Long id, Secteur details) {
        Secteur existing = findById(id);
        
        // Update dyal l-fields li 3ndek f l-Model
        existing.setCode_secteur(details.getCode_secteur());
        if (details.getNom_secteur_fr() != null) {
            existing.setNom_secteur_fr(details.getNom_secteur_fr());
        }
        if (details.getNom_secteur_ar() != null) {
            existing.setNom_secteur_ar(details.getNom_secteur_ar());
        }
        
        // Les Listes (auxiliaires w quartierSecteurs) ghaliban matandiroch lihom update hna
        // hit homa m-rbotin b "mappedBy" (homa li kiy-t-hkmou f l-relation)
        
        return secteurRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!secteurRepository.existsById(id)) {
            throw new RuntimeException("Secteur malkinahch bach n-ms-houh!");
        }
        secteurRepository.deleteById(id);
    }
    @Override
public List<Secteur> findByQuartierId(Long quartierId) {
    return secteurRepository.findByQuartierId(quartierId);
}
}