package com.example.demo.service;

import com.example.demo.model.Region;
import com.example.demo.repository.RegionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegionServiceImpl implements RegionService {

    private final RegionRepository regionRepository;

    // Constructor Injection
    public RegionServiceImpl(RegionRepository regionRepository) {
        this.regionRepository = regionRepository;
    }

    @Override
    public List<Region> findAll() {
        return regionRepository.findAll();
    }

    @Override
    public Region findById(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Region introuvable avec l'id : " + id));
    }

    @Override
    public Region save(Region r) {
        return regionRepository.save(r);
    }

    @Override
    public Region update(Long id, Region details) {
        Region existing = findById(id);
        
        // Update dyal l-m3lomat (checki smiyat f l-Model dyalk)
        existing.setNom_region_ar(details.getNom_region_ar());
        existing.setNom_region_fr(details.getNom_region_fr());
        
        return regionRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!regionRepository.existsById(id)) {
            throw new RuntimeException("Region ma-kaynach bach t-mseh!");
        }
        regionRepository.deleteById(id);
    }
}