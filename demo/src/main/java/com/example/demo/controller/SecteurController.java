package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Quartier;
import com.example.demo.model.QuartierSecteur;
import com.example.demo.model.QuartierSecteurId;
import com.example.demo.model.Secteur;
import com.example.demo.repository.QuartierRepository;
import com.example.demo.repository.QuartierSecteurRepository;
import com.example.demo.service.SecteurService;

@RestController
@RequestMapping("/api/secteurs")
public class SecteurController {

        private final SecteurService secteurService;
    public SecteurController(SecteurService secteurService) {
        this.secteurService = secteurService;
    }

    @Autowired
    private QuartierRepository quartierRepository;
    
    @Autowired
    private QuartierSecteurRepository quartierSecteurRepository;

   @GetMapping("/quartier/{quartierId}")
public List<Secteur> getSecteursByQuartier(@PathVariable Long quartierId) {
    return secteurService.findByQuartierId(quartierId);
}


    @GetMapping
    public List<Secteur> getAll() {
        return secteurService.findAll();
    }

    @GetMapping("/{id}")
    public Secteur getById(@PathVariable Long id) {
        return secteurService.findById(id);
    }

    @PostMapping
    public Secteur create(@RequestBody Map<String, Object> body) {
        String nomFr = (String) body.get("nom_secteur_fr");
        String nomAr = (String) body.get("nom_secteur_ar");
        Object quartierIdObj = body.get("quartier_id");
        
        Secteur s = new Secteur();
        s.setNom_secteur_fr(nomFr);
        s.setNom_secteur_ar(nomAr);
        
        Secteur saved = secteurService.save(s);
        
        // If quartier_id provided, create the QuartierSecteur relationship
        if (quartierIdObj != null) {
            Long quartierIdValue = Long.valueOf(quartierIdObj.toString());
            Quartier quartier = quartierRepository.findById(quartierIdValue).orElse(null);
            if (quartier != null) {
                QuartierSecteurId qsId = new QuartierSecteurId();
                qsId.setIdQuartier(quartier.getId_quartier());
                qsId.setIdSecteur(saved.getId());
                
                QuartierSecteur qs = new QuartierSecteur();
                qs.setId(qsId);
                qs.setQuartier(quartier);
                qs.setSecteur(saved);
                
                quartierSecteurRepository.save(qs);
            }
        }
        
        return saved;
    }

    @PutMapping("/{id}")
    public Secteur update(@PathVariable Long id, @RequestBody Secteur secteur) {
        return secteurService.update(id, secteur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        secteurService.delete(id);
    }
}