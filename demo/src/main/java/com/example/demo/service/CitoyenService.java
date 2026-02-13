package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Citoyen;

public interface CitoyenService {
    Citoyen save(Citoyen citoyen);
    List<Citoyen> findAll();
    Citoyen findById(Long id);
    void delete(Long id);
}