package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Commune;

public interface CommuneService {
    List<Commune> findAll();
    Commune findById(Long id);
    Commune save(Commune c);
    Commune update(Long id, Commune c);
    void delete(Long id);
    List<Commune> findByCommandmentId(Long commandementId);
}