# 🗄️ SQL - Vérification et Création de la Table Auxiliaire

## ✅ Vérifier si la table existe

```sql
-- PostgreSQL
\dt auxiliaire

-- Ou via requête
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'auxiliaire'
) AS table_exists;
```

---

## 🆕 Créer la table (si elle n'existe pas)

```sql
-- PostgreSQL
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
    CONSTRAINT fk_id_secteur FOREIGN KEY (id_secteur) 
        REFERENCES secteur(id) ON DELETE SET NULL
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_citoyen ON auxiliaire(id_citoyen);
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_secteur ON auxiliaire(id_secteur);
```

---

## 📋 Vérifier la structure de la table

```sql
-- Voir les colonnes et leurs types
\d auxiliaire

-- Ou via requête détaillée
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'auxiliaire'
ORDER BY ordinal_position;
```

**Résultat attendu:**

| column_name | data_type | is_nullable | column_default |
|-------------|-----------|-------------|-----------------|
| id_aux | integer | NO | nextval('auxiliaire_id_aux_seq'::regclass) |
| id_citoyen | character varying | YES | null |
| nom | character varying | YES | null |
| prenom | character varying | YES | null |
| cin | character varying | YES | null |
| telephone | character varying | YES | null |
| date_affectation | timestamp | YES | null |
| status | character varying | YES | null |
| active | boolean | YES | true |
| id_secteur | bigint | YES | null |

---

## 🔗 Vérifier les relations (Foreign Keys)

```sql
-- Voir les contraintes de clés étrangères
SELECT 
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.referential_constraints
WHERE table_name = 'auxiliaire';

-- Ou
\d+ auxiliaire
```

**Résultat attendu:**
```
Foreign Keys:
"auxiliaire_id_secteur_fkey" FOREIGN KEY (id_secteur) REFERENCES secteur(id)
```

---

## 🔍 Voir les données enregistrées

```sql
-- Voir tous les auxiliaires
SELECT * FROM auxiliaire;

-- Voir avec jointure au secteur
SELECT 
    a.id_aux,
    a.nom,
    a.prenom,
    a.id_citoyen,
    a.status,
    a.active,
    a.date_affectation,
    s.id as secteur_id,
    s.nom_secteur_fr as secteur_nom
FROM auxiliaire a
LEFT JOIN secteur s ON a.id_secteur = s.id
ORDER BY a.id_aux DESC;

-- Compter les auxiliaires
SELECT COUNT(*) as total_auxiliaires FROM auxiliaire;

-- Filtrer par secteur
SELECT * FROM auxiliaire WHERE id_secteur = 5;

-- Filtrer par actif
SELECT * FROM auxiliaire WHERE active = true;
```

---

## 🧹 Nettoyer les données (si nécessaire)

```sql
-- Supprimer tous les auxiliaires (ATTENTION!)
DELETE FROM auxiliaire;

-- Supprimer un auxiliaire spécifique
DELETE FROM auxiliaire WHERE id_aux = 1;

-- Supprimer les auxiliaires d'un citoyen
DELETE FROM auxiliaire WHERE id_citoyen = '42';

-- Réinitialiser la séquence d'ID
ALTER SEQUENCE auxiliaire_id_aux_seq RESTART WITH 1;
```

---

## 📊 Statistiques SQL Utiles

```sql
-- Voir la taille de la table
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size
FROM pg_tables
WHERE tablename = 'auxiliaire';

-- Voir le nombre de lignes
SELECT count(*) FROM auxiliaire;

-- Voir les auxiliaires par secteur
SELECT 
    s.nom_secteur_fr,
    COUNT(a.id_aux) as nombre_auxiliaires
FROM secteur s
LEFT JOIN auxiliaire a ON s.id = a.id_secteur
GROUP BY s.id, s.nom_secteur_fr
ORDER BY nombre_auxiliaires DESC;

-- Voir les auxiliaires par statut
SELECT 
    status,
    COUNT(*) as count
FROM auxiliaire
GROUP BY status;

-- Voir les auxiliaires actifs
SELECT 
    nam, 
    prenom, 
    status, 
    date_affectation
FROM auxiliaire
WHERE active = true
ORDER BY date_affectation DESC;
```

---

## ⚡ Commandes Rapides pgAdmin

### Via l'interface Web (pgAdmin):

1. **Ouvrez pgAdmin** → `http://localhost:5050`
2. **Connectez-vous** (user: `postgres`, ou autre)
3. **Naviguez à:**
   ```
   Servers → PostgreSQL → Databases → adressagee → Schemas → public → Tables
   ```
4. **Cliquez droit sur `auxiliaire`:**
   - `View/Edit Data` → `All Rows` (voir les données)
   - `Properties` (voir la structure)
   - `SQL` (voir le DDL)

---

## 🛠️ Dépannage

### ❌ Erreur: "Relation 'auxiliaire' does not exist"

**Solution:**
```sql
-- Créez la table
CREATE TABLE auxiliaire (
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
    CONSTRAINT fk_id_secteur FOREIGN KEY (id_secteur) REFERENCES secteur(id)
);
```

---

### ❌ Erreur: "Foreign key constraint violation"

**Cause:** L'ID du secteur n'existe pas.

**Solution:**
```sql
-- Vérifiez que le secteur existe
SELECT * FROM secteur WHERE id = 5;

-- Si le secteur n'existe pas, créez-le ou insérez un secteur valide
-- Sinon, mettez à jour l'auxiliaire avec un ID de secteur valide
UPDATE auxiliaire SET id_secteur = NULL WHERE id_secteur = 999;
```

---

### ❌ Erreur: "id_citoyen is NULL"

**Cause:** L'auxiliaire n'a pas d'ID de citoyen.

**Solution:**
```sql
-- Vérifiez les auxiliaires sans citoyen
SELECT * FROM auxiliaire WHERE id_citoyen IS NULL;

-- Associez un citoyen valide
UPDATE auxiliaire SET id_citoyen = '42' WHERE id_aux = 1;
```

---

## ✅ Checklist de Vérification

- [ ] La table `auxiliaire` existe
- [ ] Les colonnes sont correctes (id_aux, id_citoyen, nom, prenom, cin, telephone, date_affectation, status, active, id_secteur)
- [ ] La clé primaire est `id_aux`
- [ ] La clé étrangère `id_secteur` pointe vers `secteur(id)`
- [ ] Les index sont créés
- [ ] Les données test s'affichent correctement
- [ ] Pas d'erreurs de contraint de clé étrangère

---

## 🚀 Commande Complète de Préparation

Exécutez ceci dans PostgreSQL pour tout préparer:

```sql
-- 1. Créer la table si elle n'existe pas
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
    CONSTRAINT fk_id_secteur FOREIGN KEY (id_secteur) REFERENCES secteur(id) ON DELETE SET NULL
);

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_citoyen ON auxiliaire(id_citoyen);
CREATE INDEX IF NOT EXISTS idx_auxiliaire_id_secteur ON auxiliaire(id_secteur);

-- 3. Vérifier la structure
\d auxiliaire

-- 4. Voir les données
SELECT * FROM auxiliaire;

-- 5. Compter les lignes
SELECT COUNT(*) FROM auxiliaire;
```

Copie-colle cette commande complète dans pgAdmin ou psql! 🎯
