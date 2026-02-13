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
import com.example.demo.service.CommuneService;

@RestController
@RequestMapping("/api/communes")

public class CommuneController {

    private final CommuneService communeService;

    public CommuneController(CommuneService communeService) {
        this.communeService = communeService;
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