package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Quartier;
import com.example.demo.repository.QuartierRepository;

@Service
public class QuartierServiceImpl implements QuartierService {

    private final QuartierRepository quartierRepository;

    // Constructor Injection
    public QuartierServiceImpl(QuartierRepository quartierRepository) {
        this.quartierRepository = quartierRepository;
    }

    @Override
    public List<Quartier> findAll() {
        return quartierRepository.findAll();
    }

    @Override
    public Quartier findById(Long id) {
        return quartierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quartier introuvable avec l'id : " + id));
    }

    @Override
    public Quartier save(Quartier q) {
        return quartierRepository.save(q);
    }

    @Override
    public Quartier update(Long id, Quartier details) {
        Quartier existing = findById(id);
        
        // Update dyal l-m3lomat 3la hsab l-Model dyalk
        existing.setNom_quartier_ar(details.getNom_quartier_ar());
        existing.setNom_quartier_fr(details.getNom_quartier_fr());
        existing.setType_quartier(details.getType_quartier());
        existing.setCommune(details.getCommune());
        
        // quartierSecteurs ghaliban matandiroch liha update hna hit hiya OneToMany
        
        return quartierRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!quartierRepository.existsById(id)) {
            throw new RuntimeException("Quartier ma-kaynch bach i-t-mseh!");
        }
        quartierRepository.deleteById(id);
    }
@Override
    public List<Quartier> findByCommuneId(Long communeId) {
        return quartierRepository.findByCommune_IdCommune(communeId);
    }
}