package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Province;
import com.example.demo.repository.ProvinceRepository;

@Service
public class ProvinceServiceImpl implements ProvinceService { // 7iyyadna abstract

    private final ProvinceRepository provinceRepository;

    public ProvinceServiceImpl(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    @Override
    public List<Province> findAll() {
        return provinceRepository.findAll();
    }
@Override
public List<Province> findByRegionId(Long regionId) {
    return provinceRepository.findByRegionId(regionId);
}

    @Override
    public Province findById(Long id) { // Zidna had l-méthode
        return provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Province ma-kaynach!"));
    }

    @Override
    public Province save(Province p) {
        return provinceRepository.save(p);
    }

    @Override
    public Province update(Long id, Province details) {
        Province existing = findById(id);
        existing.setNom_province_ar(details.getNom_province_ar());
        existing.setNom_province_fr(details.getNom_province_fr());
        // Zidi hna ay field akhor khass i-t-update (b7al region...)
        return provinceRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!provinceRepository.existsById(id)) {
            throw new RuntimeException("Province ma-kaynach bach t-mseh!");
        }
        provinceRepository.deleteById(id);
    }
}