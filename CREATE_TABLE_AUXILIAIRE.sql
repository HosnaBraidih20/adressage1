-- === CRÉER LA TABLE AUXILIAIRE ===
-- Exécutez ce script dans pgAdmin pour créer la table auxiliaire si elle n'existe pas

-- 1. Créer la table auxiliaire
CREATE TABLE IF NOT EXISTS auxiliaire (
    id_aux SERIAL PRIMARY KEY,
    id_citoyen VARCHAR(255),
    nom VARCHAR(255),
    prenom VARCHAR(255),
    cin VARCHAR(255),
    telephone VARCHAR(255),
    date_affectation TIMESTAMP,
    status VARCHAR(255),
    active BOOLEAN DEFAULT true,
    id_secteur BIGINT,
    CONSTRAINT fk_auxiliaire_secteur FOREIGN KEY (id_secteur) 
        REFERENCES secteur(id) ON DELETE SET NULL
);

-- 2. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_citoyen ON auxiliaire(id_citoyen);
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_secteur ON auxiliaire(id_secteur);
CREATE INDEX IF NOT EXISTS idx_auxiliaire_status ON auxiliaire(status);
CREATE INDEX IF NOT EXISTS idx_auxiliaire_active ON auxiliaire(active);

-- 3. Créer la séquence pour id_aux si elle n'existe pas
CREATE SEQUENCE IF NOT EXISTS auxiliaire_id_aux_seq AS INTEGER;
ALTER SEQUENCE auxiliaire_id_aux_seq OWNED BY auxiliaire.id_aux;

-- 4. Vérifier la structure créée
\d auxiliaire

-- 5. Compter les données (devrait être 0 si nouvellement créée)
SELECT COUNT(*) as total_auxiliaires FROM auxiliaire;
