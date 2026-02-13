package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.QuartierSecteur;
import com.example.demo.model.QuartierSecteurId;

@Repository
public interface QuartierSecteurRepository extends JpaRepository<QuartierSecteur, QuartierSecteurId> {
}