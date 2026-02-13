package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Commune;
import com.example.demo.repository.CommuneRepository;

@Service
public class CommuneServiceImpl implements CommuneService {

    private final CommuneRepository communeRepository;

    // Constructor Injection
    public CommuneServiceImpl(CommuneRepository communeRepository) {
        this.communeRepository = communeRepository;
    }

    @Override
    public List<Commune> findAll() {
        return communeRepository.findAll();
    }

    @Override
    public List<Commune> findByCommandmentId(Long id) {
        return communeRepository.findByCommandementId(id);
    }




    @Override
    public Commune save(Commune c) {
        return communeRepository.save(c);
    }

    @Override
    public Commune update(Long id, Commune details) {
        Commune existing = findById(id);
        
        // Modifi had l-fields 3la hsab l-Model dyalk (Snake_case ghaliban)
        existing.setNom_commune_ar(details.getNom_commune_ar());
        existing.setNom_commune_fr(details.getNom_commune_fr());
        
        // Ila kant m-rbtah b Commandement
        if(details.getCommandement() != null) {
            existing.setCommandement(details.getCommandement());
        }
        
        return communeRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!communeRepository.existsById(id)) {
            throw new RuntimeException("Commune ma-kaynach bach i-t-mseh!");
        }
        communeRepository.deleteById(id);
    }

    @Override
    public Commune findById(Long id) {
        return communeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commune introuvable avec l'id : " + id));
    }
}