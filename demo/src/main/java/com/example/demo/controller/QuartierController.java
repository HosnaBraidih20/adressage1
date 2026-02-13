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

import com.example.demo.model.Commune;
import com.example.demo.model.Quartier;
import com.example.demo.repository.CommuneRepository;
import com.example.demo.service.QuartierService;

@RestController
@RequestMapping("/api/quartiers")
public class QuartierController {
    @Autowired
    private final CommuneRepository communeRepository;

    private final QuartierService quartierService;

    public QuartierController(QuartierService quartierService , CommuneRepository communeRepository) {
        this.quartierService = quartierService;
        this.communeRepository = communeRepository;
    }

    @GetMapping("/commune/{communeId}")
    public List<Quartier> getQuartiersByCommune(@PathVariable Long communeId) {
        return quartierService.findByCommuneId(communeId);
    }

    @GetMapping
    public List<Quartier> getAll() {
        return quartierService.findAll();
    }

    @GetMapping("/{id}")
    public Quartier getById(@PathVariable Long id) {
        return quartierService.findById(id);
    }
@PostMapping
public Quartier create(@RequestBody Map<String, Object> body) {

    String fr = (String) body.get("nom_quartier_fr");
    String ar = (String) body.get("nom_quartier_ar");
    Long communeId = Long.valueOf(body.get("communeId").toString());

    Commune commune = communeRepository.findById(communeId)
        .orElseThrow(() -> new RuntimeException("Commune not found"));

    Quartier q = new Quartier();
    q.setNom_quartier_fr(fr);
    q.setNom_quartier_ar(ar);
    q.setCommune(commune);

    return quartierService.save(q);
}




    
    @PutMapping("/{id}")
    public Quartier update(@PathVariable Long id, @RequestBody Quartier quartier) {
        return quartierService.update(id, quartier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        quartierService.delete(id);
    }
}