package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Province;
import com.example.demo.service.ProvinceService;

@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {

    private final ProvinceService provinceService;

    public ProvinceController(ProvinceService provinceService) {
        this.provinceService = provinceService;
    }


    @GetMapping
    public List<Province> getProvincesByRegion(@RequestParam(required = false) Long regionId) {
        if (regionId != null) {
            return provinceService.findByRegionId(regionId);
        }
        return provinceService.findAll();
    }

   @GetMapping("/region/{regionId}")
    public List<Province> getByRegion(@PathVariable Long regionId) {
        return provinceService.findByRegionId(regionId);
    }

    @PostMapping
    public Province create(@RequestBody Province province) {
        return provinceService.save(province);
    }

    @PutMapping("/{id}")
    public Province update(@PathVariable Long id, @RequestBody Province province) {
        return provinceService.update(id, province);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        provinceService.delete(id);
    }
}