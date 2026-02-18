import axios from "axios";

import React, { useState, useEffect } from 'react';
import { addAuxiliaire } from "../services/api";
// import { addCitoyen } from "../services/api";
import { 
  getRegions, 
  getProvincesByRegion, 
  getPachaliksByProvince,
  getCommandementByPachalik,
  getCommuneByCommandement,     
  getQuartiersByCommune,
  getSecteursByQuartier,
  addQuartier, 
  addSecteur,   
  addCommune
    , addCitoyen
} from '../services/api';
import LocationSum from '../components/location/LocationSum';
import ValidationButton from '../components/form/validationButton';
import Swal from 'sweetalert2';

// Fonction helper pour convertir les dates
// dateNaissance (Citoyen): LocalDate → YYYY-MM-DD
// dateAffectation (Auxiliaire): LocalDateTime → YYYY-MM-DDTHH:MM:SS
const convertToDateString = (dateStr, isDateTime = false) => {
  if (!dateStr) {
    console.warn('⚠️ convertToDateString: dateStr vide');
    return null;
  }
  
  console.log(`🔄 convertToDateString - Entrée: ${dateStr}, isDateTime: ${isDateTime}`);
  
  // Si c'est au format ISO complet, utiliser tel quel pour LocalDateTime
  if (isDateTime && dateStr.includes('T')) {
    console.log('✅ convertToDateString - Déjà au format ISO DateTime:', dateStr);
    return dateStr;
  }
  
  // Si c'est juste la date (sans T)
  if (!dateStr.includes('T')) {
    if (isDateTime) {
      // Pour LocalDateTime, ajouter l'heure: YYYY-MM-DD → YYYY-MM-DDTHH:MM:SS
      const dateTimeString = dateStr + 'T00:00:00';
      console.log('✅ convertToDateString - Avec heure pour LocalDateTime:', dateTimeString);
      return dateTimeString;
    } else {
      // Pour LocalDate, garder YYYY-MM-DD
      console.log('✅ convertToDateString - Garder YYYY-MM-DD pour LocalDate:', dateStr);
      return dateStr;
    }
  }
  
  // Si c'est au format ISO avec T, extraire la date seule si pas LocalDateTime
  if (!isDateTime && dateStr.includes('T')) {
    const dateOnly = dateStr.split('T')[0];
    console.log('✅ convertToDateString - Extraire date seule pour LocalDate:', dateOnly);
    return dateOnly;
  }
  
  console.log('✅ convertToDateString - Retourner tel quel:', dateStr);
  return dateStr;
};

const RegisterPage = () => {
  // Lists for Dropdowns
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [pachaliks, setPachaliks] = useState([]);
  const [commandements, setCommandements] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSecteurs, setLoadingSecteurs] = useState(false);
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);
const [showAddCommune, setShowAddCommune] = useState(false);
const [newCommune, setNewCommune] = useState({
  nom_commune_ar: '',
  nom_commune_fr: ''
});

const [isAuxiliaire, setIsAuxiliaire] = useState(false);

const [auxData, setAuxData] = useState({
  nom: "",
  prenom: "",
  cin: "",
  telephone: "",
  dateAffectation: "",
  status: "",
  active: true
});





const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log("=== FORM SUBMISSION === isAuxiliaire:", isAuxiliaire);
  console.log("Form Data:", formData);
  console.log("Auxiliaire Data:", auxData);
  console.log("Form Valid:", isFormValid());
  
  setLoading(true);

  // Validate required fields
  if (!formData.nom?.trim() || !formData.prenom?.trim()) {
    console.warn("❌ Nom ou Prenom vides");
    Swal.fire('Attention', 'Nom et Prénom sont obligatoires', 'warning');
    setLoading(false);
    return;
  }

  // Validate location hierarchy - if commune is selected, quartier must be selected
  if (formData.commune && !formData.quartier) {
    console.warn("❌ Commune sélectionnée mais pas de Quartier");
    Swal.fire('Attention', 'Veuillez sélectionner un Quartier', 'warning');
    setLoading(false);
    return;
  }

  // If quartier is selected, validate secteur
  if (formData.quartier) {
    if (loadingSecteurs) {
      console.warn("❌ Secteurs en cours de chargement");
      Swal.fire('Attention', 'Secteurs en cours de chargement, veuillez attendre', 'warning');
      setLoading(false);
      return;
    }
    if (secteurs.length === 0) {
      console.warn("❌ Aucun secteur disponible pour ce quartier");
      Swal.fire('Attention', 'Aucun secteur disponible. Veuillez ajouter un secteur.', 'warning');
      setLoading(false);
      return;
    }
    if (!formData.secteur) {
      console.warn("❌ Quartier sélectionné mais pas de Secteur");
      Swal.fire('Attention', 'Veuillez sélectionner un Secteur', 'warning');
      setLoading(false);
      return;
    }
  }

  // If auxiliaire is enabled, validate required fields
  if (isAuxiliaire) {
    if (!auxData.nom?.trim() || !auxData.prenom?.trim()) {
      console.warn("❌ Auxiliaire: Nom ou Prenom vides");
      Swal.fire('Attention', 'Auxiliaire: Nom et Prénom sont obligatoires', 'warning');
      setLoading(false);
      return;
    }
    if (!formData.secteur) {
      console.warn("❌ Auxiliaire: Secteur doit être sélectionné");
      Swal.fire('Attention', 'Auxiliaire: Veuillez sélectionner un Secteur', 'warning');
      setLoading(false);
      return;
    }
  }

  const safeNumber = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const num = Number(v);
    if (isNaN(num)) {
      console.error("Invalid number conversion for:", v);
      return null;
    }
    return num;
  };

  // Log les données avant conversion
  console.log("📋 AVANT CONVERSION:");
  console.log("  - formData.dateNaissance (RAW):", formData.dateNaissance, typeof formData.dateNaissance);
  console.log("  - auxData.dateAffectation (RAW):", auxData.dateAffectation, typeof auxData.dateAffectation);

  // Convertir les dates
  // dateNaissance: LocalDate (pas d'heure) → YYYY-MM-DD
  const dateNaissanceConverted = formData.dateNaissance ? convertToDateString(formData.dateNaissance, false) : null;
  // dateAffectation: LocalDateTime (avec heure) → YYYY-MM-DDTHH:MM:SS
  const dateAffectationConverted = auxData.dateAffectation ? convertToDateString(auxData.dateAffectation, true) : new Date().toISOString().split('.')[0];

  console.log("📋 APRÈS CONVERSION:");
  console.log("  - dateNaissanceConverted (LocalDate):", dateNaissanceConverted);
  console.log("  - dateAffectationConverted (LocalDateTime):", dateAffectationConverted);

  const citoyenPayload = {
    cin: formData.cin || null,
    nom: formData.nom ? String(formData.nom) : null,
    prenom: formData.prenom ? String(formData.prenom) : null,
    dateNaissance: dateNaissanceConverted,
    adresse: formData.adresse || null,
    telephone: formData.telephone || null,
    pachalik: formData.pachalik ? { id: safeNumber(formData.pachalik) } : null,
    commandement: formData.commandement ? { id: safeNumber(formData.commandement) } : null,
    commune: formData.commune ? { id_commune: safeNumber(formData.commune) } : null,
    quartier: formData.quartier ? { id_quartier: safeNumber(formData.quartier) } : null,
    secteur: formData.secteur ? { id: safeNumber(formData.secteur) } : null
  };

  console.log("📤 CITOYEN PAYLOAD ENVOYÉ:", citoyenPayload);

  try {
    // Step 1: Add CITOYEN
    console.log('📡 Enregistrement du Citoyen...');
    const citoyenRes = await addCitoyen(citoyenPayload);
    console.log("✅ Citoyen créé avec succès:", citoyenRes.data);
    const idCitoyen = citoyenRes.data.id;

    // Step 2: Add AUXILIAIRE if enabled
    if (isAuxiliaire && formData.secteur) {
      console.log('📡 Enregistrement de l\'Auxiliaire...');
      const auxiliairePayload = {
        nom: auxData.nom ? String(auxData.nom) : String(formData.nom),
        prenom: auxData.prenom ? String(auxData.prenom) : String(formData.prenom),
        cin: auxData.cin ? String(auxData.cin) : String(formData.cin),
        telephone: auxData.telephone ? String(auxData.telephone) : String(formData.telephone),
        dateAffectation: dateAffectationConverted,
        status: auxData.status || "ACTIF",
        active: auxData.active === true ? true : false,
        idCitoyen: String(idCitoyen),
        secteur: { id: safeNumber(formData.secteur) }
      };
      console.log("📤 AUXILIAIRE PAYLOAD ENVOYÉ:", auxiliairePayload);
      const auxiliaireRes = await addAuxiliaire(auxiliairePayload);
      console.log("✅ Auxiliaire créé avec succès:", auxiliaireRes.data);
      
      Swal.fire('Succès!', 'Citoyen et Auxiliaire enregistrés avec succès', 'success');
    } else {
      Swal.fire('Succès!', 'Citoyen enregistré avec succès', 'success');
    }

    // Reset all form data
    setFormData({
      cin: "", nom: "", prenom: "", dateNaissance: "",
      adresse: "", telephone: "",
      region: "", province: "", pachalik: "",
      commandement: "", commune: "", quartier: "", secteur: ""
    });
    setAuxData({
      nom: "",
      prenom: "",
      cin: "",
      telephone: "",
      dateAffectation: "",
      status: "",
      active: true
    });
    setDisplayLabels({
      region: '', province: '', pachalik: '', commandement: '', commune: '', quartier: '', secteur: ''
    });
    setIsAuxiliaire(false);
    setLoadingSecteurs(false);
    setLoadingQuartiers(false);

  } catch (err) {
    console.error("❌ BACKEND ERROR:", {
      message: err.message,
      responseData: err.response?.data,
      status: err.response?.status,
      config: err.config,
      request: err.request
    });
    const errMsg = err.response?.data?.message || err.response?.data || err.message;
    Swal.fire('Erreur', `Échec: ${typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)}`, 'error');
  } finally {
    setLoading(false);
  }
};




  // Form Data
  const [formData, setFormData] = useState({
    nom: '', prenom: '', cin: '', dateNaissance: '', adresse: '', telephone: '',
    region: '', province: '', pachalik: '',commandement: '',commune: '', quartier: '', secteur: ''
  });

  // Labels for Summary
  const [displayLabels, setDisplayLabels] = useState({
    region: '', province: '', pachalik: '', commandement: '', commune: '', quartier: '', secteur: ''
  });

  // Load regions on mount
  useEffect(() => {
    getRegions()
      .then(res => setRegions(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegionChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ ...prev, region: id, province: '', pachalik: '', commandement: '', commune: '', quartier: '', secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, region: name, province: '', pachalik: '', commandement: '', commune: '', quartier: '', secteur: '' }));

    setProvinces([]); setPachaliks([]); setCommandements([]);setCommunes([]); setQuartiers([]); setSecteurs([]); 

    if (id) {
      try {
        const res = await getProvincesByRegion(id);
        setProvinces(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error(err); }
    }
  };

  const handleProvinceChange = async (e) => {
    console.log("Selected Province   :", e);
    const idProvince = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ 
      ...prev, province: idProvince, pachalik: '', commandement: '',commune: '', quartier: '', secteur: '' 
    }));
    setDisplayLabels(prev => ({ 
      ...prev, province: provinceName, pachalik: '', commandement: '', commune: '', quartier: '', secteur: '' 
    }));

    setPachaliks([]);  setCommandements([]);setCommunes([]); setQuartiers([]); setSecteurs([]);

    if (idProvince) {
      try {
        const res = await getPachaliksByProvince(idProvince);
        if (res && res.data) {
          setPachaliks(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Erreur pachaliks:", err);
      }
    }
  };

  const handlePachalikChange = async (e) => {
    
    const id = e.target.value;
    console.log("Selected Pachalik :", e);
    
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ ...prev, pachalik: id,  commandement: '',commune: '', quartier: '', secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, pachalik: name,  commandement: '',commune: '', quartier: '', secteur: '' }));

     setCommandements([]);setCommunes([]); setQuartiers([]); setSecteurs([]);

    if (id) {
      try {
        const resComm =  await getCommandementByPachalik(id);
        console.log("Data Commandements reçue:", resComm.data);
        setCommandements(Array.isArray(resComm.data) ? resComm.data : []);
      } catch(err){ 
        console.error("Erreur commandements:", err); 
      }
    }
  }; 

  const handleCommuneChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ ...prev, commune: id,  quartier: '', secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, commune: name, quartier: '', secteur: '' }));

    setQuartiers([]); setSecteurs([]);
    setLoadingQuartiers(false);
    setLoadingSecteurs(false);

    if(id) {
      setLoadingQuartiers(true);
      try {
        const res = await getQuartiersByCommune(id);
        setQuartiers(Array.isArray(res.data) ? res.data : []);
      } catch(err){ 
        console.error(err); 
      } finally {
        setLoadingQuartiers(false);
      }
    }
  };

  const handleCommandementChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    console.log("ID Commandement sélectionné:", id);
    setFormData(prev => ({ ...prev, commandement: id,commune: '', quartier: '', secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, commandement: name,commune: '', quartier: '', secteur: '' }));

    setCommunes([]); setQuartiers([]); setSecteurs([]);

    if(id) {
      try {
        const res = await getCommuneByCommandement(id);
        console.log("Données Communes reçues:", res.data)
        const communeList = Array.isArray(res.data) ? res.data : [];
        if (communeList.length > 0) {
          console.log("Structure de la première commune:", communeList[0]);
          console.log("ID disponible comme:", {
            id_commune: communeList[0].id_commune,
            idCommune: communeList[0].idCommune,
            id: communeList[0].id
          });
        }
        setCommunes(communeList);
        console.log(`${communeList.length} communes chargées pour le commandement ${id}`);
      } catch(err){ 
        console.error("Erreur chargement communes:", err);
        Swal.fire("Attention", "Erreur lors du chargement des communes", "warning");
      }
    }
  };





const handleAddCommune = async () => {
  if (!newCommune.nom_commune_fr || !newCommune.nom_commune_ar) {
    return Swal.fire("Attention", "Remplir les deux noms", "warning");
  }

  if (!formData.commandement) {
    return Swal.fire("Attention", "Veuillez choisir un commandement d'abord", "warning");
  }

  console.log("Communes déjà chargées:", communes);

  // Check if commune already exists
  const isDuplicate = communes.some(c => 
    c.nom_commune_fr?.toLowerCase().trim() === newCommune.nom_commune_fr.toLowerCase().trim() &&
    c.nom_commune_ar?.trim() === newCommune.nom_commune_ar.trim()
  );

  if (isDuplicate) {
    return Swal.fire("Attention", "Cette commune existe déjà", "warning");
  }

  try {
    const safeNumber = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

    const payload = {
      nom_commune_ar: newCommune.nom_commune_ar,
      nom_commune_fr: newCommune.nom_commune_fr,
      commandement: { id: safeNumber(formData.commandement) }
    };

    console.log("Payload envoyé:", payload);
    const res = await addCommune(payload);
    
    console.log("Réponse reçue:", res.data);
    const communeId = res.data.idCommune || res.data.id_commune || res.data.id;
    
    setCommunes(prev => [...prev, res.data]);
    setFormData(prev => ({ ...prev, commune: communeId }));
    setDisplayLabels(prev => ({ ...prev, commune: res.data.nom_commune_fr }));

    setShowAddCommune(false);
    setNewCommune({ nom_commune_ar: '', nom_commune_fr: '' });

    Swal.fire("Succès", "Commune ajoutée", "success");

  } catch (err) {
    console.error("Erreur détaillée:", {
      message: err.message,
      responseData: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers
    });
    Swal.fire("Erreur", `Échec: ${err.response?.data?.message || err.message}`, "error");
  }
};






  const handleQuartierChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    console.log("📍 Quartier sélectionné:", { id, name });
    setFormData(prev => ({ ...prev, quartier: id, secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, quartier: name, secteur: '' }));

    setSecteurs([]);
    setLoadingSecteurs(false);

    if(id) {
      setLoadingSecteurs(true);
      console.log("🔄 Chargement des secteurs pour quartier", id);
      try {
        const res = await getSecteursByQuartier(id);
        const loaded = Array.isArray(res.data) ? res.data : [];
        console.log(`✅ ${loaded.length} secteurs chargés:`, loaded);
        setSecteurs(loaded);
      } catch(err){ 
        console.error("❌ Erreur lors du chargement des secteurs:", err); 
      } finally {
        setLoadingSecteurs(false);
      }
    }
  };

  const handleSecteurChange = (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, secteur: id }));
    setDisplayLabels(prev => ({ ...prev, secteur: name }));
  };



const handleAddQuartier = async () => {
  if (!formData.commune) return Swal.fire('Attention', 'Veuillez choisir une commune !', 'warning');

  const { value: formValues } = await Swal.fire({
    title: '<span class="text-indigo-600">Nouveau Quartier</span>',
    html: `
      <div class="flex flex-col space-y-3">
        <input id="swal-nom-fr" class="swal2-input custom-input" placeholder="Nom du quartier (FR)">
        <input id="swal-nom-ar" class="swal2-input custom-input text-right" placeholder="اسم الحي (AR)">
        <select id="swal-type" class="swal2-input custom-input">
          <option value="QUARTIER">Quartier</option>
          <option value="LOTISSEMENT">Lotissement</option>
          <option value="DOUAR">Douar</option>
          <option value="ZONE_INDUSTRIELLE">Zone Industrielle</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Ajouter',
    confirmButtonColor: '#4f46e5',
    preConfirm: () => {
      const nomFr = document.getElementById('swal-nom-fr').value;
      const nomAr = document.getElementById('swal-nom-ar').value;
      const type = document.getElementById('swal-type').value;
      if (!nomFr || !nomAr) {
        Swal.showValidationMessage('Veuillez remplir tous les noms');
      }
      return { nom_quartier_fr: nomFr, nom_quartier_ar: nomAr, type_quartier: type };
    }
  });


if (formValues) {
  try {
    const res = await addQuartier({
      nom_quartier_fr: formValues.nom_quartier_fr,
      nom_quartier_ar: formValues.nom_quartier_ar,
      communeId: formData.commune
    });

    if (res.data) {
      setQuartiers(prev => [...prev, res.data]);
    }

    Swal.fire('Succès !', 'Le quartier a été ajouté.', 'success');
  } catch (err) {
    console.error("ERREUR BACKEND =", err.response?.data || err.message);
    Swal.fire('Erreur', "Échec de l'ajout au serveur", 'error');
  }
}



const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    nom: formData.nom,
    prenom: formData.prenom,
    cin: formData.cin,
    telephone: formData.telephone,
    region: formData.region ? { id: formData.region } : null,
    province: formData.province ? { id: formData.province } : null,
    pachalik: formData.pachalik ? { id: formData.pachalik } : null,
    commune: formData.commune ? { id: formData.commune } : null,
    commandement: formData.commandement ? { id: formData.commandement } : null,
    quartier: formData.quartier ? { id: formData.quartier } : null,
    secteur: formData.secteur ? { id: formData.secteur } : null,
  };

  const res = await addCitoyen(payload); // <== res defined here

  if (isAuxiliaire && payload.secteur) {
    // await addAuxiliaire({
    //   nom: payload.nom,
    //   prenom: payload.prenom,
    //   cin: payload.cin,
    //   telephone: payload.telephone,
    //   status: auxData.status,
    //   active: auxData.active,
    //   idCitoyen: res.data.id,
    //   dateAffectation: new Date().toISOString(),
    //    secteur: { id: payload.secteur.id }
    // });
    console.log("📤 AUXILIAIRE à envoyer:", {
  idCitoyen: formData.cin,
  dateAffectation: new Date().toISOString(),
  active: true,
  status: "ACTIF",
  nom: formData.nom,
  prenom: formData.prenom,
  cin: formData.cin,
  telephone: formData.telephone,
  secteur: formData.secteur ? { id: Number(formData.secteur) } : null
});
   
  }

  alert("Enregistrement réussi !");
};






}

const handleAddSecteur = async () => {
    if (!formData.quartier) return Swal.fire('Attention', 'Veuillez choisir un quartier !', 'warning');
    const { value: formValues } = await Swal.fire({
      title: '<span class="text-indigo-600">Nouveau Secteur</span>',
      html: `
        <div class="flex flex-col space-y-3">
          <input id="swal-sect-fr" class="swal2-input custom-input" placeholder="Secteur (FR)">
          <input id="swal-sect-ar" class="swal2-input custom-input text-right" placeholder="القطاع (AR)">
        </div>`,
      confirmButtonText: 'Ajouter',
      confirmButtonColor: '#4f46e5',
      showCancelButton: true,
      preConfirm: () => {
        const fr = document.getElementById('swal-sect-fr').value;
        const ar = document.getElementById('swal-sect-ar').value;
        if (!fr || !ar) return Swal.showValidationMessage('Veuillez remplir les noms');
        return { nom_secteur_fr: fr, nom_secteur_ar: ar };
      }
    });

    if (formValues) {
      try {
        const res = await addSecteur({ ...formValues, quartier_id: formData.quartier });
        const newS = res.data;
        setSecteurs(prev => [...prev, newS]);

       
        setFormData(prev => ({ ...prev, secteur: newS.id }));
        setDisplayLabels(prev => ({ ...prev, secteur: newS.nom_secteur_fr }));

        Swal.fire('Succès !', 'Secteur ajouté et sélectionné.', 'success');
      } catch (err) { Swal.fire('Erreur', "Échec de l'ajout", 'error'); }
    }
  };






// console.log("quartiers:", quartiers);
// console.log("secteurs:", secteurs);

  // Calculate if form is valid
  const isFormValid = () => {
    // Required: nom and prenom
    if (!formData.nom?.trim() || !formData.prenom?.trim()) return false;
    
    // If commune is selected
    if (formData.commune) {
      // Quartiers are still loading
      if (loadingQuartiers) return false;
      // If quartiers list is empty after loading, something went wrong
      if (quartiers.length === 0) return false;
      // Quartier must be selected
      if (!formData.quartier) return false;
      
      // If quartier is selected
      if (formData.quartier) {
        // Secteurs are still loading
        if (loadingSecteurs) return false;
        // If secteurs list is empty after loading, something went wrong
        if (secteurs.length === 0) return false;
        // Secteur must be selected
        if (!formData.secteur) return false;
      }
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-700 p-10 text-white relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tight">l'ADRESSAGE</h1>
            <p className="text-indigo-200 mt-2">Gestion Intelligente du Découpage Administratif</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Nom</label>
              <input name="nom" value={formData.nom} onChange={handleChange} placeholder="EL OMARI" className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
              <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="YASSINE" className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">CIN</label>
              <input name="cin" value={formData.cin} onChange={handleChange} placeholder="AB123456" className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="06 12 34 56 78" className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Date de naissance</label>
              <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse</label>
              <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Quartier, Ville, Pays" className="w-full h-12 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all font-semibold"/>
            </div>
          </div>

          <hr className="border-gray-200"/>

          {/* Administrative Hierarchy Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Région */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Région</label>
              <select name="region" value={formData.region} onChange={handleRegionChange} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all">
                <option value="">-- Région --</option>
                {regions.map(r => <option key={r.id_region} value={r.id_region}>{r.nom_region_fr} | {r.nom_region_ar}</option>)}
              </select>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Province</label>
              <select name="province" value={formData.province} onChange={handleProvinceChange} disabled={!formData.region} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Province --</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.nom_province_fr} | {p.nom_province_ar}</option>)}
              </select>
            </div>

            {/* Pachalik */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Pachalik</label>
              <select name="pachalik" value={formData.pachalik} onChange={handlePachalikChange} disabled={!formData.province} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Pachalik --</option>
                {pachaliks.map(pk => <option key={pk.id} value={pk.id}>{pk.nom_pachalik_fr} | {pk.nom_pachalik_ar}</option>)}
              </select>
            </div>

            {/* Commandement */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Commandement</label>
              <select name="commandement" value={formData.commandement} onChange={handleCommandementChange} disabled={!formData.pachalik} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Commandement --</option>
                {commandements.map(cmd => <option key={cmd.id} value={cmd.id}>{cmd.nom_commandement_fr} | {cmd.nom_commandement_ar}</option>)}
              </select>
            </div>

            {/* Commune */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Commune</label>
                {communes.length === 0 && formData.commandement && (
                  <button type="button" onClick={() => setShowAddCommune(true)} className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition">
                    +
                  </button>
                )}
              </div>
              <select name="commune" value={formData.commune} onChange={handleCommuneChange} disabled={!formData.commandement} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Commune --</option>
                {communes.map(c => {
                  const communeId = c.id_commune || c.idCommune || c.id;
                  return <option key={communeId} value={communeId}>{c.nom_commune_fr} | {c.nom_commune_ar}</option>;
                })}
              </select>
            </div>

            {/* Quartier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Quartier</label>
                {formData.commune && (
                  <button type="button" onClick={handleAddQuartier} className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition">+</button>
                )}
              </div>
              <select name="quartier" value={formData.quartier} onChange={handleQuartierChange} disabled={!formData.commune} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Quartier --</option>
                {(quartiers || []).filter(q => q && q.id_quartier).map(q => <option key={q.id_quartier} value={q.id_quartier}>{q.nom_quartier_fr} | {q.nom_quartier_ar}</option>)}
              </select>
            </div>

            {/* Secteur */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Secteur</label>
                {formData.quartier && (
                  <button type="button" onClick={handleAddSecteur} className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition">+</button>
                )}
              </div>
              <select name="secteur" value={formData.secteur} onChange={handleSecteurChange} disabled={!formData.quartier} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Secteur --</option>
                {secteurs.map(s => <option key={s.id} value={s.id}>{s.nom_secteur_fr}</option>)}
              </select>
            </div>
          </div>

         






{/* MODAL ADD COMMUNE */}
          {showAddCommune && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl">
                <h2 className="text-xl font-bold text-indigo-700 mb-4">Ajouter une Commune</h2>
                <input type="text" placeholder="Nom Commune (FR)" value={newCommune.nom_commune_fr} onChange={(e) => setNewCommune({ ...newCommune, nom_commune_fr: e.target.value })} className="w-full h-10 px-4 mb-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none"/>
                <input type="text" placeholder="Nom Commune (AR)" value={newCommune.nom_commune_ar} onChange={(e) => setNewCommune({ ...newCommune, nom_commune_ar: e.target.value })} className="w-full h-10 px-4 mb-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-right"/>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowAddCommune(false)} className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50">Annuler</button>
                  <button onClick={handleAddCommune} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Ajouter</button>
                </div>
              </div>
            </div>
          )}






          <hr className="border-gray-200"/>

          {/* Auxiliaire Section */}
          <div onClick={() => setIsAuxiliaire(!isAuxiliaire)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${isAuxiliaire ? "bg-indigo-50 border-indigo-500 shadow-md" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-indigo-700">Agent Auxiliaire</h3>
                <p className="text-sm text-gray-500">Activer le profil auxiliaire</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${isAuxiliaire ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                {isAuxiliaire ? "ACTIF" : "INACTIF"}
              </span>
            </div>
          </div>
{isAuxiliaire && formData.secteur && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200">

   
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Nom</label>
                <input type="text" value={auxData.nom} onChange={(e) => setAuxData({ ...auxData, nom: e.target.value })} placeholder="Nom" className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Prénom</label>
                <input type="text" value={auxData.prenom} onChange={(e) => setAuxData({ ...auxData, prenom: e.target.value })} placeholder="Prénom" className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">CIN</label>
                <input type="text" value={auxData.cin} onChange={(e) => setAuxData({ ...auxData, cin: e.target.value })} placeholder="CIN" className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Téléphone</label>
                <input type="tel" value={auxData.telephone} onChange={(e) => setAuxData({ ...auxData, telephone: e.target.value })} placeholder="06XXXXXXXX" className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Date Affectation</label>
                <input type="date" value={auxData.dateAffectation} onChange={(e) => setAuxData({ ...auxData, dateAffectation: e.target.value })} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Statut</label>
                <input type="text" value={auxData.status} onChange={(e) => setAuxData({ ...auxData, status: e.target.value })} placeholder="Agent, Chef..." className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase ml-1">Actif</label>
                <select value={auxData.active ? "true" : "false"} onChange={(e) => setAuxData({ ...auxData, active: e.target.value === "true" })} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all">
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
            </div>
          )}

          <ValidationButton loading={loading} disabled={!isFormValid()}/>
        </form>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <LocationSum data={formData} labels={displayLabels}/>
      </div>
    </div>
  );
};

export default RegisterPage;
