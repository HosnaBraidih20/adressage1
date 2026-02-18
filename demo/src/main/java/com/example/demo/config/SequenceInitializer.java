package com.example.demo.config;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SequenceInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    public SequenceInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        // Reset all sequences to prevent duplicate key conflicts
        resetSequence("commune_id_commune_seq", "commune", "id_commune");
        resetSequence("commandement_id_commandement_seq", "commandement", "id_commandement");
        resetSequence("region_id_region_seq", "region", "id_region");
        resetSequence("province_id_province_seq", "province", "id_province");
        resetSequence("quartier_id_quartier_seq", "quartier", "id_quartier");
        resetSequence("secteur_id_secteur_seq", "secteur", "id_secteur");
        resetSequence("pachalik_id_pachalik_seq", "pachalik", "id_pachalik");
        resetSequence("auxiliaire_id_auxiliaire_seq", "auxiliaire", "id_auxiliaire");
        resetSequence("citoyen_id_citoyen_seq", "citoyen", "id_citoyen");
        
        System.out.println("✓ Database sequences initialized successfully");
    }

    private void resetSequence(String sequenceName, String tableName, String columnName) {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            String sql = String.format(
                "SELECT setval('%s', (SELECT COALESCE(MAX(%s), 0) + 1 FROM %s), false)",
                sequenceName, columnName, tableName
            );
            stmt.executeQuery(sql);
            System.out.println("  ✓ Reset sequence: " + sequenceName);
        } catch (SQLException e) {
            System.out.println("  ⚠ Could not reset sequence " + sequenceName + " - " + e.getMessage());
        }
    }
}
