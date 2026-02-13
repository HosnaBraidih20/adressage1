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

import com.example.demo.model.Auxiliaire;
import com.example.demo.service.AuxiliaireService;

@RestController
@RequestMapping("/api/auxiliaires")
public class AuxiliaireController {

    private final AuxiliaireService auxiliaireService;

    public AuxiliaireController(AuxiliaireService auxiliaireService) {
        this.auxiliaireService = auxiliaireService;
    }

    @GetMapping
    public List<Auxiliaire> getAll() {
        return auxiliaireService.findAll();
    }

    @GetMapping("/{id}")
    public Auxiliaire getById(@PathVariable Long id) {
        return auxiliaireService.findById(id);
    }

    @PostMapping
    public Auxiliaire create(@RequestBody Auxiliaire auxiliaire) {
        return auxiliaireService.save(auxiliaire);
    }

    @PutMapping("/{id}")
    public Auxiliaire update(@PathVariable Long id, @RequestBody Auxiliaire auxiliaire) {
        return auxiliaireService.update(id, auxiliaire);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        auxiliaireService.delete(id);
    }
}