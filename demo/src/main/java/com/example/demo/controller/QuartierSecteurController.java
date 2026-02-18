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

    @GetMapping("/{id}")
    public QuartierSecteur getById(@PathVariable Long id) {
        return quartierSecteurService.findById(id);
    }

    @PostMapping
    public QuartierSecteur create(@RequestBody QuartierSecteur qs) {
        return quartierSecteurService.save(qs);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        quartierSecteurService.delete(id);
    }
}