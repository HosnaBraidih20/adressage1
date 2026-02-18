package com.example.demo.service;

import com.example.demo.model.QuartierSecteur;
import java.util.List;

public interface QuartierSecteurService {
    List<QuartierSecteur> findAll();
    QuartierSecteur findById(Long id);
    QuartierSecteur save(QuartierSecteur qs);
    void delete(Long id);
}