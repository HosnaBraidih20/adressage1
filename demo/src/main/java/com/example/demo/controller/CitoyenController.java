package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Citoyen;
import com.example.demo.repository.CitoyenRepository;
import com.example.demo.service.CitoyenService;

@RestController
@RequestMapping("/api/citoyens")
public class CitoyenController {

    private final CitoyenRepository citoyenRepository;
    private final CitoyenService citoyenService;    

    public CitoyenController(CitoyenRepository citoyenRepository, CitoyenService citoyenService) {
        this.citoyenRepository = citoyenRepository;
        this.citoyenService = citoyenService;
    }

    @PostMapping
    public Citoyen createCitoyen(@RequestBody Citoyen citoyen) {
        // Cette méthode va enregistrer le citoyen dans la base de données
        return citoyenRepository.save(citoyen);
    }
    @GetMapping
    public List<Citoyen> getAll() {
        return citoyenService.findAll();
    }
}