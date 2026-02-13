package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Pachalik;

public interface PachalikService {
    List<Pachalik> findAll();
    List<Pachalik> findByProvinceId(Long provinceId); // T-akdi mn had l-ligne
    Pachalik findById(Long id);
    Pachalik save(Pachalik p);
    Pachalik update(Long id, Pachalik details);
    void delete(Long id);
}