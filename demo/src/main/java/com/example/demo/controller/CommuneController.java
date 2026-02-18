package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Commune;
import com.example.demo.repository.CommuneRepository;
import com.example.demo.service.CommuneService;

@RestController
@RequestMapping("/api/communes")

public class CommuneController {

    private final CommuneService communeService;
    private final CommuneRepository communeRepository;

    public CommuneController(CommuneService communeService, CommuneRepository communeRepository) {
        this.communeService = communeService;
        this.communeRepository = communeRepository;
    }

    @GetMapping
    public List<Commune> getAll() {
        return communeService.findAll();
    }

   
    @GetMapping("/commandement/{commandementId}")
    public List<Commune> getCommuneByCommandement(@PathVariable Long commandementId) {
        return communeService.findByCommandmentId(commandementId);
    }

    @PostMapping
    public Commune create(@RequestBody Commune commune) {
        // For new records, always clear the ID to let PostgreSQL generate it
        // This prevents duplicate key violations when client sends an ID
        commune.setIdCommune(null);
        
        // Check if a commune with the same commandement and name already exists
        if (commune.getCommandement() != null && commune.getNom_commune_fr() != null) {
            var allByCommandement = communeRepository.findByCommandementId(commune.getCommandement().getId());
            for (Commune c : allByCommandement) {
                if (commune.getNom_commune_fr().equals(c.getNom_commune_fr())) {
                    return c;  // Return existing commune instead of creating duplicate
                }
            }
        }
        
        return communeService.save(commune);
    }

    @PutMapping("/{id}")
    public Commune update(@PathVariable Long id, @RequestBody Commune commune) {
        return communeService.update(id, commune);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        communeService.delete(id);
    }
}