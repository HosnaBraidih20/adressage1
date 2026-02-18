# ✅ CHECKLIST COMPLÈTE - Test et Vérification Auxiliaire

## 📋 Phase 1: Préparation de l'Environnement

### ✅ 1.1 Vérifier la Base de Données

- [ ] PostgreSQL est en cours d'exécution
- [ ] Base de données `adressagee` existe
- [ ] Table `auxiliaire` existe avec les colonnes correctes:
  ```sql
  SELECT * FROM auxiliaire LIMIT 1;
  ```
- [ ] Table `secteur` existe et a des données:
  ```sql
  SELECT COUNT(*) FROM secteur;
  ```
- [ ] Les clés étrangères sont configurées correctement:
  ```sql
  \d auxiliaire
  ```

**Résultat attendu:** Pas d'erreur SQL, table vide initialement (COUNT = 0)

---

### ✅ 1.2 Vérifier le Backend Spring Boot

- [ ] Terminal ouvert dans: `c:\Users\Province\Documents\adressagee\demo`
- [ ] Fichier `pom.xml` existe
- [ ] Fichier `src/main/java/com/example/demo/DemoApplication.java` existe
- [ ] Fichier `src/main/resources/application.properties` existe avec le bon port:
  ```properties
  server.port=8081
  spring.datasource.url=jdbc:postgresql://localhost:5432/adressagee
  ```

**Résultat attendu:** Structure Spring Boot correcte

---

### ✅ 1.3 Vérifier le Frontend React

- [ ] Terminal ouvert dans: `c:\Users\Province\Documents\adressagee\dressagefront`
- [ ] Fichier `package.json` existe
- [ ] Dossier `src/` existe avec `App.js`
- [ ] Fichier `src/services/api.js` existe et contient:
  ```javascript
  export const addAuxiliaire = (data) => API.post("/auxiliaires", data);
  ```

**Résultat attendu:** Structure React correcte

---

## 📈 Phase 2: Compilation & Build

### ✅ 2.1 Compiler le Backend Java

```bash
cd c:\Users\Province\Documents\adressagee\demo
./mvnw clean compile
```

**Étapes à observer:**
- [ ] `[INFO] Scanning for projects...`
- [ ] `[INFO] Compiling...` (plusieurs fichiers)
- [ ] `[INFO] BUILD SUCCESS`

**Si erreur:**
- [ ] Vérifiez la syntaxe Java
- [ ] Vérifiez les imports dans les fichiers modifiés
- [ ] Exécutez `./mvnw clean` et réessayez

**Résultat attendu:** `BUILD SUCCESS - 0 erreurs`

---

### ✅ 2.2 Vérifier les Fichiers Modifiés

- [ ] Fichier `src/main/java/com/example/demo/controller/AuxiliaireController.java`
  - Contient la méthode `@PostMapping` avec logging
  - Contient les `System.out.println` avec emoji 📡

- [ ] Fichier `src/main/java/com/example/demo/service/AuxiliaireServiceImpl.java`
  - Contient la méthode `save()` avec logging
  - Contient `System.out.println` avant/après l'enregistrement

**Résultat attendu:** Fichiers modifiés correctement

---

## 🚀 Phase 3: Démarrage des Services

### ✅ 3.1 Démarrer le Backend

**Terminal 1 - Backend Spring Boot:**

```bash
cd c:\Users\Province\Documents\adressagee\demo
./mvnw spring-boot:run
```

**À observer dans le terminal:**
- [ ] `[INFO] Scanning for projects...`
- [ ] `[INFO] Compiling...`
- [ ] `[INFO] Building...`
- [ ] `[INFO] Started DemoApplication in X.XXX seconds`
- [ ] `[INFO] Catalina started on port(s): 8081`

**Si erreur "Port 8081 already in use":**
```bash
# Trouver le processus
netstat -ano | findstr :8081

# Terminer le processus (remplacez PID)
taskkill /PID <PID> /F

# Ou attendre quelques secondes et relancer
```

**Résultat attendu:** Backend en cours d'exécution sur le port 8081

---

### ✅ 3.2 Démarrer le Frontend React

**Terminal 2 - Frontend React:**

```bash
cd c:\Users\Province\Documents\adressagee\dressagefront
npm start
```

**À observer dans le terminal:**
- [ ] `react-scripts start`
- [ ] `Compiled successfully!`
- [ ] `You can now view dressagefront in the browser.`
- [ ] Automatiquement ouvre `http://localhost:3000`

**Si erreur "Port 3000 already in use":**
```bash
# Terminer le processus précédent ou utiliser un autre port
npm start -- --port 3001
```

**Résultat attendu:** Frontend chargé à `http://localhost:3000`

---

## 🧪 Phase 4: Test du Formulaire

### ✅ 4.1 Naviguer vers la Page d'Enregistrement

- [ ] Frontend est chargé à `http://localhost:3000`
- [ ] Cliquez sur le lien "Enregistrer" ou accédez à `/register`
- [ ] La page `RegisterPage` s'affiche
- [ ] Les sections citoyen et auxiliaire sont visibles

**Résultat attendu:** Formulaire d'enregistrement visible

---

### ✅ 4.2 Remplir le Formulaire - Section Citoyen

Remplissez ces champs **obligatoires:**

- [ ] **Nom:** `TestNom`
- [ ] **Prénom:** `TestPrenom`
- [ ] **CIN:** `AB123456`
- [ ] **Téléphone:** `+212612345678`
- [ ] **Adresse:** `123 Rue Test`
- [ ] **Date Naissance:** `01/01/1990`

**Champs géographiques - cliquez en cascade:**

1. [ ] **Région:** (première sélection dans le dropdown)
2. [ ] **Province:** (attendre le chargement, puis sélectionner)
3. [ ] **Pachalik:** (attendre le chargement, puis sélectionner)
4. [ ] **Commandement:** (attendre le chargement, puis sélectionner)
5. [ ] **Commune:** (attendre le chargement, puis sélectionner)
6. [ ] **Quartier:** (attendre le chargement, puis sélectionner)

**Résultat attendu:** Tous les champs citoyen remplis

---

### ✅ 4.3 Activer et Remplir la Section Auxiliaire

- [ ] **Cochez la case:** "Agent Auxiliaire" (checkbox)
- [ ] Attendez que la section auxiliaire s'affiche
- [ ] Remplissez les champs auxiliaire:

  - [ ] **Nom:** `AuxNom`
  - [ ] **Prénom:** `AuxPrenom`
  - [ ] **CIN:** `CD654321`
  - [ ] **Téléphone:** `+212687654321`
  - [ ] **Statut:** `ACTIF` (dropdown)
  - [ ] **Actif:** (checkbox coché)

- [ ] **Secteur:** Sélectionnez un secteur du dropdown (demande lors du clic)

**Résultat attendu:** Les deux sections (citoyen + auxiliaire) sont complètes

---

### ✅ 4.4 Soumettre le Formulaire

- [ ] Cliquez sur le bouton **"Enregistrer"**
- [ ] **Attendez 2-3 secondes** pour le traitement

**Si popup de succès:**
- [ ] Message "Succès! Citoyen et Auxiliaire enregistrés avec succès" s'affiche
- [ ] Cliquez sur "OK" pour fermer le popup

**Résultat attendu:** Pas d'erreur JavaScript, formulaire soumis

---

## 🔍 Phase 5: Vérification des Logs

### ✅ 5.1 Logs du Frontend (Console du Navigateur)

**Ouvrez les outils développeur:**
- [ ] Appuyez sur **F12** (ou Clic droit → "Inspecter")
- [ ] Allez à l'onglet **"Console"**
- [ ] Soumettez le formulaire à nouveau

**Vous devriez voir ces logs en ordre:**

```javascript
//1. Payload citoyen
[REGISTER - CITOYEN] Payload envoyé:
{nom: "TestNom", prenom: "TestPrenom", ...}

//2. Réponse citoyen
[REGISTER - CITOYEN] Réponse reçue (Citoyen):
{id: "123456", nom: "TestNom", ...}

//3. ID extrait
[REGISTER - AUXILIAIRE] idCitoyen extrait:
123456

//4. Payload auxiliaire
[REGISTER - AUXILIAIRE] Payload envoyé:
{idCitoyen: "123456", nom: "AuxNom", ...}

//5. Réponse auxiliaire
[REGISTER - AUXILIAIRE] Réponse reçue (Auxiliaire):
{idAux: 1, idCitoyen: "123456", ...}

//6. Succès
[REGISTER - AUXILIAIRE] ✅ Citoyen et Auxiliaire enregistrés
```

**Logs à noter:**
- [ ] Cherchez l'`idCitoyen` extrait (ex: `123456`)
- [ ] Cherchez l'`idAux` retourné (ex: `1`)
- [ ] Pas d'erreur "undefined" ou "null"

### ⚠️ Dépannage Console

Si vous voyez une erreur:

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot read property 'data' of undefined` | La réponse citoyen est vide | Vérifiez que le citoyen a été créé |
| `idCitoyen is undefined` | L'extraction du ID a échoué | Vérifiez la structure de la réponse |
| `Cannot POST /api/auxiliaires` | Le contrôleur n'existe pas | Vérifiez que le backend est compilé |
| `Network error` | Le backend ne répond pas | Vérifiez que le backend est en cours d'exécution sur le port 8081 |

---

### ✅ 5.2 Logs du Backend (Terminal)

**Regardez le terminal du backend (Terminal 1):**

Vous devriez voir ces logs en ordre:

```
📡 [AUXILIAIRE CONTROLLER] POST /api/auxiliaires reçu
📡 [AUXILIAIRE CONTROLLER] Data - Nom: AuxNom, Prenom: AuxPrenom, CIN: CD654321, Telephone: +212687654321
📡 [AUXILIAIRE CONTROLLER] Status: ACTIF, Active: true, Secteur ID: 5
📡 [AUXILIAIRE SERVICE] Enregistrement auxiliaire reçu: Nom=AuxNom, Prenom=AuxPrenom
✅ Auxiliaire enregistré avec succès. ID: 1
```

**Logs à noter:**
- [ ] Le statut par défaut est `ACTIF` même si non spécifié
- [ ] La date affectation est définie automatiquement
- [ ] L'ID retourné est un nombre (ex: `1`)

### ⚠️ Dépannage Backend

Si vous voyez une erreur:

| Erreur | Cause | Solution |
|--------|-------|----------|
| `No mapping found for POST /api/auxiliaires` | Contrôleur non compilé | Relancez `./mvnw clean compile` |
| `Validation failed for object in binding` | Données invalides | Vérifiez les types de données |
| `Foreign key constraint violation` | Le secteur n'existe pas | Sélectionnez un secteur valide |
| `Connection refused` | PostgreSQL arrêté | Démarrez PostgreSQL |

---

## 💾 Phase 6: Vérification de la Base de Données

### ✅ 6.1 Vérifier les Données Enregistrées

**Via pgAdmin:**

1. [ ] Ouvrez pgAdmin: `http://localhost:5050`
2. [ ] Connectez-vous
3. [ ] Naviguez: `Servers → PostgreSQL → Databases → adressagee → Schemas → public → Tables → auxiliaire`
4. [ ] Clic droit → `View/Edit Data → All Rows`

**Via SQL (psql ou pgAdmin Query):**

```sql
-- Voir tous les auxiliaires
SELECT * FROM auxiliaire;

-- Voir le dernier enregistré
SELECT * FROM auxiliaire ORDER BY id_aux DESC LIMIT 1;

-- Vérifier avec jointure secteur
SELECT 
    a.id_aux,
    a.nom,
    a.prenom,
    a.id_citoyen,
    a.status,
    a.active,
    s.nom_secteur_fr
FROM auxiliaire a
LEFT JOIN secteur s ON a.id_secteur = s.id
WHERE a.nom = 'AuxNom';
```

**Résultat attendu:**

| id_aux | id_citoyen | nom | prenom | cin | status | active | secteur_id |
|--------|-----------|-----|--------|-----|--------|--------|------------|
| 1 | 123456 | AuxNom | AuxPrenom | CD654321 | ACTIF | t | 5 |

---

### ✅ 6.2 Vérifier l'Intégrité des Données

- [ ] `id_citoyen` correspond à l'ID créé dans le formulaire
- [ ] `nom` = `AuxNom` (exactement comme saisi)
- [ ] `prenom` = `AuxPrenom` (exactement comme saisi)
- [ ] `cin` = `CD654321` (exactement comme saisi)
- [ ] `status` = `ACTIF` (défini automatiquement ou saisi)
- [ ] `active` = `true` (coché dans le formulaire)
- [ ] `date_affectation` = Today's date (défini automatiquement)
- [ ] `id_secteur` = Un ID valide de la table `secteur`

**Résultat attendu:** Tous les champs sont corrects et non-NULL

---

### ✅ 6.3 Tests Supplémentaires SQL

```sql
-- Compter les auxiliaires
SELECT COUNT(*) FROM auxiliaire;

-- Vérifier les statuts
SELECT status, COUNT(*) as count FROM auxiliaire GROUP BY status;

-- Vérifier les actifs
SELECT COUNT(*) FROM auxiliaire WHERE active = true;

-- Voir les auxiliaires par secteur
SELECT s.nom_secteur_fr, COUNT(a.id_aux) 
FROM auxiliaire a
LEFT JOIN secteur s ON a.id_secteur = s.id
GROUP BY s.id, s.nom_secteur_fr;
```

**Résultat attendu:** Les requêtes réussissent sans erreur

---

## 🔄 Phase 7: Tests Avancés

### ✅ 7.1 Tester sans Auxiliaire (Citoyen Seul)

- [ ] Rechargez le formulaire (`F5`)
- [ ] Remplissez **uniquement** la section citoyen
- [ ] **Ne cochez PAS** la case "Agent Auxiliaire"
- [ ] Cliquez sur "Enregistrer"

**Attendu:**
- [ ] Message "Succès! Citoyen enregistré avec succès"
- [ ] Aucune ligne dans la table `auxiliaire` pour ce citoyen
- [ ] Une ligne dans la table `citoyen`

---

### ✅ 7.2 Tester avec Même Citoyen, Plusieurs Auxiliaires

- [ ] Récupérez l'`id` du citoyen créé précédemment
- [ ] Créez une requête API manuelle pour ajouter un 2ème auxiliaire:

```javascript
// Dans la console du navigateur
const auxData = {
    nom: "AuxNom2",
    prenom: "AuxPrenom2",
    cin: "EF789012",
    telephone: "+212699999999",
    status: "ACTIF",
    active: true,
    idCitoyen: "123456", // ID du citoyen précédent
    secteur: { id: 5 }
};

fetch('http://localhost:8081/api/auxiliaires', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auxData)
})
.then(r => r.json())
.then(data => console.log('Succès:', data))
.catch(err => console.error('Erreur:', err));
```

**Attendu:**
- [ ] ID retourné (ex: `2`)
- [ ] Deux lignes dans `auxiliaire` avec le même `id_citoyen`

---

### ✅ 7.3 Tester la Validation

- [ ] Tentez de soumettre avec des champs manquants
- [ ] Vérifiez que des messages d'erreur s'affichent
- [ ] Vérifiez que les données ne sont **pas** enregistrées si validation échoue

**Attendu:** Validation fonctionne côté frontend et backend

---

## 📊 Phase 8: Résumé de Vérification

### ✅ Checklist Finale

- [ ] ✅ Compilé sans erreur: `BUILD SUCCESS`
- [ ] ✅ Backend en cours d'exécution: Port 8081 actif
- [ ] ✅ Frontend en cours d'exécution: Port 3000 actif
- [ ] ✅ Formulaire soumis avec succès
- [ ] ✅ Logs frontend affichent tous les appels API
- [ ] ✅ Logs backend affichent reception et enregistrement
- [ ] ✅ Données présentes dans la table `auxiliaire`
- [ ] ✅ Les ID correspondent entre citoyen et auxiliaire
- [ ] ✅ Les types de données sont corrects
- [ ] ✅ Les relations de clés étrangères sont valides

### 🎉 Résultat Final

Si toutes les cases sont cochées: **SUCCÈS! Le problème est résolu! **

Les auxiliaires sont maintenant enregistrés correctement dans la base de données.

---

## 🆘 Aide Supplémentaire

### Cas d'Erreur Courants

**❌ Erreur: Table `auxiliaire` n'existe pas**
```sql
-- Créez-la
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

**❌ Erreur: CIN ou téléphone invalide**
- Vérifiez le format des données
- Vérifiez que les champs ne sont pas vides

**❌ Erreur: Secteur invalide**
- Sélectionnez un secteur différent
- Vérifiez que le secteur existe: `SELECT * FROM secteur LIMIT 5;`

**❌ Erreur: Port 8081 déjà utilisé**
```bash
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

---

## 📞 Contact & Support

Si vous rencontrez d'autres problèmes:

1. **Vérifiez les logs** (F12 Frontend, Terminal Backend)
2. **Vérifiez la base de données** (pgAdmin)
3. **Vérifiez les ports** (8081 Backend, 3000 Frontend)
4. **Redémarrez les services** (arrêtez et relancez)
5. **Nettoyez les données** (DELETE FROM auxiliaire et réessayez)

Bonne chance! 🚀
