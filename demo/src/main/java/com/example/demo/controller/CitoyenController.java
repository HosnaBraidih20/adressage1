package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Citoyen;
import com.example.demo.repository.CitoyenRepository;
import com.example.demo.repository.QuartierRepository;
import com.example.demo.service.CitoyenService;

@RestController
@RequestMapping("/api/citoyens")
public class CitoyenController {

    private final CitoyenRepository citoyenRepository;
    private final CitoyenService citoyenService;
    private final QuartierRepository quartierRepository;

    public CitoyenController(CitoyenRepository citoyenRepository, CitoyenService citoyenService, QuartierRepository quartierRepository) {
        this.citoyenRepository = citoyenRepository;
        this.citoyenService = citoyenService;
        this.quartierRepository = quartierRepository;
    }

    @PostMapping
    public Citoyen createCitoyen(@RequestBody Map<String, Object> body) {
        // Create Citoyen object from the request body
        Citoyen citoyen = new Citoyen();
        citoyen.setNom((String) body.get("nom"));
        citoyen.setPrenom((String) body.get("prenom"));
        citoyen.setCin((String) body.get("cin"));
        citoyen.setTelephone((String) body.get("telephone"));
        citoyen.setAdresse((String) body.get("adresse"));
        
        // Handle date if provided
        if (body.get("dateNaissance") != null) {
            citoyen.setDateNaissance(java.time.LocalDate.parse((String) body.get("dateNaissance")));
        }
        
        // Get quartier ID and fetch the full quartier object
        Object quartierIdObj = body.get("quartier") != null ? 
            ((Map<String, Object>) body.get("quartier")).get("id_quartier") : 
            body.get("id_quartier");
        
        if (quartierIdObj != null) {
            Long quartierIdValue = Long.valueOf(quartierIdObj.toString());
            var quartierOpt = quartierRepository.findById(quartierIdValue);
            if (quartierOpt.isPresent()) {
                var quartier = quartierOpt.get();
                citoyen.setQuartier(quartier);
                
                // Get commune from quartier
                if (quartier.getCommune() != null) {
                    citoyen.setCommune(quartier.getCommune());
                    
                    // Get commandement from commune if not provided
                    if (body.get("id_commandement") == null && quartier.getCommune().getCommandement() != null) {
                        citoyen.setCommandement(quartier.getCommune().getCommandement());
                    }
                }
            }
        }
        
        // Ensure commune is set before saving
        if (citoyen.getCommune() == null) {
            throw new IllegalArgumentException("Commune must be provided or derived from Quartier");
        }
        
        return citoyenRepository.save(citoyen);
    }
    
    @GetMapping
    public List<Citoyen> getAll() {
        return citoyenService.findAll();
    }
}