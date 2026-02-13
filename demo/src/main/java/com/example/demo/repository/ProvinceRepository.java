package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Province;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {

    
    @Query("SELECT p FROM Province p WHERE p.region.id_region = :regionId")
    List<Province> findByRegionId(@Param("regionId") Long regionId);
}