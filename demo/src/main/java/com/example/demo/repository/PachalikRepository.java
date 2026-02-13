package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Pachalik;

@Repository
public interface PachalikRepository extends JpaRepository<Pachalik, Long> {

    List<Pachalik> findByProvince_Id(Long idProvince);
}