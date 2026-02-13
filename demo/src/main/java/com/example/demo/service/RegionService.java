package com.example.demo.service;

import com.example.demo.model.Region;
import java.util.List;

public interface RegionService {
    List<Region> findAll();
    Region findById(Long id);
    Region save(Region r);
    Region update(Long id, Region r);
    void delete(Long id);
}