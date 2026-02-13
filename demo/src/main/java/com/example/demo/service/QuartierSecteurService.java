package com.example.demo.service;

import com.example.demo.model.QuartierSecteur;
import com.example.demo.model.QuartierSecteurId;
import java.util.List;

public interface QuartierSecteurService {
    List<QuartierSecteur> findAll();
    QuartierSecteur findById(QuartierSecteurId id);
    QuartierSecteur save(QuartierSecteur qs);
    void delete(QuartierSecteurId id);
}