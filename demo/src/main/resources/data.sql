-- Reset sequences to prevent duplicate key conflicts
-- This runs automatically on application startup (spring.jpa.hibernate.ddl-auto=update)

-- Reset commune sequence to max ID + 1
SELECT setval('commune_id_commune_seq', (SELECT COALESCE(MAX(id_commune), 0) + 1 FROM commune), false);

-- Reset commandement sequence
SELECT setval('commandement_id_commandement_seq', (SELECT COALESCE(MAX(id_commandement), 0) + 1 FROM commandement), false);

-- Reset region sequence
SELECT setval('region_id_region_seq', (SELECT COALESCE(MAX(id_region), 0) + 1 FROM region), false);

-- Reset province sequence
SELECT setval('province_id_province_seq', (SELECT COALESCE(MAX(id_province), 0) + 1 FROM province), false);

-- Reset quartier sequence
SELECT setval('quartier_id_quartier_seq', (SELECT COALESCE(MAX(id_quartier), 0) + 1 FROM quartier), false);

-- Reset secteur sequence
SELECT setval('secteur_id_secteur_seq', (SELECT COALESCE(MAX(id_secteur), 0) + 1 FROM secteur), false);

-- Reset pachalik sequence
SELECT setval('pachalik_id_pachalik_seq', (SELECT COALESCE(MAX(id_pachalik), 0) + 1 FROM pachalik), false);

-- Reset auxiliaire sequence
SELECT setval('auxiliaire_id_auxiliaire_seq', (SELECT COALESCE(MAX(id_auxiliaire), 0) + 1 FROM auxiliaire), false);

-- Reset citoyen sequence
SELECT setval('citoyen_id_citoyen_seq', (SELECT COALESCE(MAX(id_citoyen), 0) + 1 FROM citoyen), false);
