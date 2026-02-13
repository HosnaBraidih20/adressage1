package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.QuartierSecteur;
import com.example.demo.model.QuartierSecteurId;
import com.example.demo.service.QuartierSecteurService;

@RestController
@RequestMapping("/api/quartier-secteurs")
public class QuartierSecteurController {

    private final QuartierSecteurService quartierSecteurService;

    public QuartierSecteurController(QuartierSecteurService quartierSecteurService) {
        this.quartierSecteurService = quartierSecteurService;
    }

    @GetMapping
    public List<QuartierSecteur> getAll() {
        return quartierSecteurService.findAll();
    }

    // Bach tjib wahed: /api/quartier-secteurs/1/5
    @GetMapping("/{idQuartier}/{idSecteur}")
    public QuartierSecteur getById(@PathVariable Long idQuartier, @PathVariable Long idSecteur) {
        QuartierSecteurId id = new QuartierSecteurId();
        id.setIdQuartier(idQuartier);
        id.setIdSecteur(idSecteur);
        return quartierSecteurService.findById(id);
    }

    @PostMapping
    public QuartierSecteur create(@RequestBody QuartierSecteur qs) {
        return quartierSecteurService.save(qs);
    }

    @DeleteMapping("/{idQuartier}/{idSecteur}")
    public void delete(@PathVariable Long idQuartier, @PathVariable Long idSecteur) {
        QuartierSecteurId id = new QuartierSecteurId();
        id.setIdQuartier(idQuartier);
        id.setIdSecteur(idSecteur);
        quartierSecteurService.delete(id);
    }
}