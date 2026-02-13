package com.example.demo.service;

import com.example.demo.model.Auxiliaire;
import com.example.demo.repository.AuxiliaireRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuxiliaireServiceImpl implements AuxiliaireService {

    private final AuxiliaireRepository auxiliaireRepository;

    public AuxiliaireServiceImpl(AuxiliaireRepository auxiliaireRepository) {
        this.auxiliaireRepository = auxiliaireRepository;
    }

    @Override
    public List<Auxiliaire> findAll() {
        return auxiliaireRepository.findAll();
    }

    @Override
    public Auxiliaire findById(Long id) {
        return auxiliaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auxiliaire introuvable m3a had l-ID: " + id));
    }

    @Override
    public Auxiliaire save(Auxiliaire a) {
        return auxiliaireRepository.save(a);
    }

    @Override
    public Auxiliaire update(Long id, Auxiliaire details) {
        Auxiliaire existing = findById(id);
        
        // Hna khdemt b smiyat li derti f l-Model dyalk
        existing.setId_citoyen(details.getId_citoyen());
        existing.setDate_affectation(details.getDate_affectation());
        existing.setActive(details.isActive());
        existing.setStatus(details.getStatus());
        existing.setSecteur(details.getSecteur());
        
        return auxiliaireRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!auxiliaireRepository.existsById(id)) {
            throw new RuntimeException("Auxiliaire ma-kaynch!");
        }
        auxiliaireRepository.deleteById(id);
    }
}