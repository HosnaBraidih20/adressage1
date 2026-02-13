package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Commandement; // Darori had l-import

@Repository
public interface CommandementRepository extends JpaRepository<Commandement, Long> {
    List<Commandement> findByPachalik_Id(Long id);
}