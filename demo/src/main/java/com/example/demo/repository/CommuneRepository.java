package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Commune;
@Repository
public interface CommuneRepository extends JpaRepository<Commune, Long> {
    List<Commune> findByCommandementId(Long id);
}


