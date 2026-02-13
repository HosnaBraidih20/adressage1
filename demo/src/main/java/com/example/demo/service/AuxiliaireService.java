package com.example.demo.service;

import com.example.demo.model.Auxiliaire;
import java.util.List;

public interface AuxiliaireService {
    List<Auxiliaire> findAll();
    Auxiliaire findById(Long id);
    Auxiliaire save(Auxiliaire a);
    Auxiliaire update(Long id, Auxiliaire a);
    void delete(Long id);
}