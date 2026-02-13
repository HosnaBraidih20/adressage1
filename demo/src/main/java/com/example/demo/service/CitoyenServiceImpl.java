package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Citoyen;
import com.example.demo.repository.CitoyenRepository;

@Service
public class CitoyenServiceImpl implements CitoyenService {

    private final CitoyenRepository citoyenRepository;

    public CitoyenServiceImpl(CitoyenRepository citoyenRepository) {
        this.citoyenRepository = citoyenRepository;
    }

    @Override
    public Citoyen save(Citoyen citoyen) {
        return citoyenRepository.save(citoyen);
    }

    @Override
    public List<Citoyen> findAll() {
        return citoyenRepository.findAll();
    }

    @Override
    public Citoyen findById(Long id) {
        return citoyenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citoyen ma-kaynch!"));
    }

    @Override
    public void delete(Long id) {
        citoyenRepository.deleteById(id);
    }
}