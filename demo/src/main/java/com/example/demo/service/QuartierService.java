package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Quartier;

public interface QuartierService {
    List<Quartier> findAll();
    Quartier findById(Long id);
    Quartier save(Quartier q);
    Quartier update(Long id, Quartier q);
    void delete(Long id);
    java.util.List<Quartier>  findByCommuneId(Long communeId);
}