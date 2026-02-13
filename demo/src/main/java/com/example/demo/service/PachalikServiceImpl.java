package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Pachalik;
import com.example.demo.repository.PachalikRepository;
@Service
public class PachalikServiceImpl implements PachalikService {

    private final PachalikRepository pachalikRepository;

    public PachalikServiceImpl(PachalikRepository pachalikRepository) {
        this.pachalikRepository = pachalikRepository;
    }

    @Override
    public List<Pachalik> findAll() {
        return pachalikRepository.findAll();
    }

    @Override
    public List<Pachalik> findByProvinceId(Long idProvince) {
        return pachalikRepository.findByProvince_Id(idProvince);
    }

    @Override
    public Pachalik save(Pachalik p) {
        return pachalikRepository.save(p);
    }

    @Override
    public Pachalik update(Long id, Pachalik p) {
        Pachalik existing = pachalikRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pachalik ma-kaynach"));

        existing.setNom_pachalik_ar(p.getNom_pachalik_ar());
        existing.setNom_pachalik_fr(p.getNom_pachalik_fr());
        existing.setType(p.getType());
        existing.setProvince(p.getProvince());

        return pachalikRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        pachalikRepository.deleteById(id);
    }

    @Override
    public Pachalik findById(Long id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
