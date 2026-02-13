package com.example.demo.service;

import com.example.demo.model.Commandement;
import com.example.demo.repository.CommandementRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommandementServiceImpl implements CommandementService {
    @Override
    public java.util.List<Commandement> findByPachalikId(Long pachalikId) {
        return commandementRepository.findByPachalik_Id(pachalikId);
    }

    private final CommandementRepository commandementRepository;

    // Injection via le constructeur (Ahssen tariqa)
    public CommandementServiceImpl(CommandementRepository commandementRepository) {
        this.commandementRepository = commandementRepository;
    }

    @Override
    public List<Commandement> findAll() {
        return commandementRepository.findAll();
    }

    @Override
    public Commandement findById(Long id) {
        return commandementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commandement introuvable m3a had l-ID: " + id));
    }

    @Override
    public Commandement save(Commandement c) {
        return commandementRepository.save(c);
    }

    @Override
    public Commandement update(Long id, Commandement details) {
        // 1. Kan-qalbo 3la l-commandement li deja f la base
        Commandement existing = findById(id);
        
        // 2. Kan-modifiw l-khidma b les Getters dyal Lombok li m-generiyyin mn l-Model
        existing.setNom_commandement_ar(details.getNom_commandement_ar());
        existing.setNom_commandement_fr(details.getNom_commandement_fr());
        existing.setPachalik(details.getPachalik());
        
        // 3. Kan-sajlo l-m3lomat l-jdida
        return commandementRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!commandementRepository.existsById(id)) {
            throw new RuntimeException("Commandement ma-kaynch!");
        }
        commandementRepository.deleteById(id);
    }
}