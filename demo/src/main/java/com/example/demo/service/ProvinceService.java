package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Province;

public interface ProvinceService {
    List<Province> findAll();
    List<Province> findByRegionId(Long regionId);
    Province save(Province p);
    Province update(Long id, Province details);
    void delete(Long id);
    Province findById(Long id);
}