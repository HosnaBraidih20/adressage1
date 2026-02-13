package com.example.demo.service;

import com.example.demo.model.Commandement;
import java.util.List;

public interface CommandementService {
    List<Commandement> findAll(); // Khass t-koun List<Commandement>
    Commandement findById(Long id);
    Commandement save(Commandement c);
    Commandement update(Long id, Commandement c);
    void delete(Long id);
    java.util.List<Commandement> findByPachalikId(Long pachalikId);
}