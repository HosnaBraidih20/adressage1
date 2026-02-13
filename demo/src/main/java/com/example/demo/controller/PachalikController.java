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

import com.example.demo.model.Pachalik;
import com.example.demo.service.PachalikService;

@RestController
@RequestMapping("/api/pachaliks")
public class PachalikController {

    private final PachalikService pachalikService;

    public PachalikController(PachalikService pachalikService) {
        this.pachalikService = pachalikService;
    }

    @GetMapping
    public List<Pachalik> getAll() {
        return pachalikService.findAll();
    }

    @GetMapping("/province/{provinceId}")
    public List<Pachalik> getPachaliksByProvince(@PathVariable Long provinceId) {
        return pachalikService.findByProvinceId(provinceId);
    }


    @PostMapping
    public Pachalik create(@RequestBody Pachalik pachalik) {
        return pachalikService.save(pachalik);
    }

    @PutMapping("/{id}")
    public Pachalik update(@PathVariable Long id, @RequestBody Pachalik pachalik) {
        return pachalikService.update(id, pachalik);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        pachalikService.delete(id);
    }
}