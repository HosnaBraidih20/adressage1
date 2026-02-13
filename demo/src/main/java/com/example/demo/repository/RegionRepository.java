package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Region;

public interface RegionRepository extends JpaRepository<Region, Long> {}