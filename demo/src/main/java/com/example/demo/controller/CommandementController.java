package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Commandement;
import com.example.demo.service.CommandementService;

@RestController
@RequestMapping("/api/commandements")
public class CommandementController {
    @GetMapping("/pachalik/{pachalikId}")
    public List<Commandement> getCommandementByPachalik(@PathVariable Long pachalikId) {
        return commandementService.findByPachalikId(pachalikId);
    }

    private final CommandementService commandementService;

    public CommandementController(CommandementService commandementService) {
        this.commandementService = commandementService;
    }

    @GetMapping
    public List<Commandement> getAll() {
        return commandementService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commandement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(commandementService.findById(id));
    }

    @PostMapping
    public Commandement create(@RequestBody Commandement c) {
        return commandementService.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commandement> update(@PathVariable Long id, @RequestBody Commandement c) {
        return ResponseEntity.ok(commandementService.update(id, c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commandementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}