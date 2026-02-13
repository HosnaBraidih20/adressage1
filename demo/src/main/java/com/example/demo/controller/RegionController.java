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

import com.example.demo.model.Region;
import com.example.demo.service.RegionService;

@RestController
@RequestMapping("/api/regions")
// @CrossOrigin(origins = "http://localhost:3001")
public class RegionController {

    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    @GetMapping
    public List<Region> getRegions() {
        return regionService.findAll();
    }

    // @GetMapping("/{id}")
    // public Region getById(@PathVariable Long id) {
    //     return regionService.findById(id);
    // }
    @PostMapping
    public Region create(@RequestBody Region region) {
        return regionService.save(region);
    }

    @PutMapping("/{id}")
    public Region update(@PathVariable Long id, @RequestBody Region region) {
        return regionService.update(id, region);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        regionService.delete(id);
    }
}