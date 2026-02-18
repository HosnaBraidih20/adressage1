package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.QuartierSecteur;
import com.example.demo.repository.QuartierSecteurRepository;

@Service
public class QuartierSecteurServiceImpl implements QuartierSecteurService {

    private final QuartierSecteurRepository quartierSecteurRepository;

    public QuartierSecteurServiceImpl(QuartierSecteurRepository quartierSecteurRepository) {
        this.quartierSecteurRepository = quartierSecteurRepository;
    }

    @Override
    public List<QuartierSecteur> findAll() {
        return quartierSecteurRepository.findAll();
    }

    @Override
    public QuartierSecteur findById(Long id) {
        return quartierSecteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Association Quartier-Secteur introuvable !"));
    }

    @Override
    @Transactional // ضرورية في الـ Save والـ Delete باش إلا وقع مشكل يرجع كلشي كيف كان
    public QuartierSecteur save(QuartierSecteur qs) {
        return quartierSecteurRepository.save(qs);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!quartierSecteurRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Association introuvable !");
        }
        quartierSecteurRepository.deleteById(id);
    }
}