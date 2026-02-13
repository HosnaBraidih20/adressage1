import axios from "axios";

import React, { useState, useEffect } from 'react';
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
const [showAddCommune, setShowAddCommune] = useState(false);
const [newCommune, setNewCommune] = useState({
  nom_commune_ar: '',
  nom_commune_fr: ''
});







const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Validate required fields
  if (!formData.nom?.trim() || !formData.prenom?.trim()) {
    Swal.fire('Attention', 'Nom et Prénom sont obligatoires', 'warning');
    setLoading(false);
    return;
  }

    const safeNumber = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

    const payload = {
      // match backend Citoyen entity field names
      cin: formData.cin || null,
      nom: formData.nom ? String(formData.nom) : null,
      prenom: formData.prenom ? String(formData.prenom) : null,
      dateNaissance: formData.dateNaissance || null,
      adresse: formData.adresse || null,
      telephone: formData.telephone || null,
      // Send all location relationships
      pachalik: formData.pachalik ? { id: safeNumber(formData.pachalik) } : null,
      commandement: formData.commandement ? { id: safeNumber(formData.commandement) } : null,
      commune: formData.commune ? { idCommune: safeNumber(formData.commune) } : null,
      quartier: formData.quartier ? { id_quartier: safeNumber(formData.quartier) } : null,
      secteur: formData.secteur ? { id: safeNumber(formData.secteur) } : null
    };

    console.log("DATA TO SEND:", payload);

    try {
    console.log('REQUEST PAYLOAD (raw):', JSON.stringify(payload));
      const res = await addCitoyen(payload); // Ensure addCitoyen is imported
    console.log("RESPONSE =", res.data);
    Swal.fire('Succès', 'Citoyen ajouté avec succès', 'success');

    setFormData({
      cin: "", nom: "", prenom: "", dateNaissance: "",
      adresse: "", telephone: "",
      region: "", province: "", pachalik: null,
      commandement: null, commune: null, quartier: "", secteur: ""
    });

  } catch (err) {
    console.error("BACK ERROR full =", {
      message: err.message,
      responseData: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
      request: err.request
    });
    // show helpful message in dev, keep generic for users
    const errMsg = err.response?.data?.message || err.response?.data || err.message;
    Swal.fire('Erreur', `Échec: ${JSON.stringify(errMsg)}`, 'error');
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

    if(id) {
      try {
        const res = await getQuartiersByCommune(id);
        setQuartiers(Array.isArray(res.data) ? res.data : []);
      } catch(err){ console.error(err); }
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
        setCommunes(Array.isArray(res.data) ? res.data : []);
      } catch(err){ console.error(err); }
    }
  };





const handleAddCommune = async () => {
  if (!newCommune.nom_commune_fr || !newCommune.nom_commune_ar) {
    return Swal.fire("Attention", "Remplir les deux noms", "warning");
  }

  try {
    const payload = {
      nom_commune_ar: newCommune.nom_commune_ar,
      nom_commune_fr: newCommune.nom_commune_fr,
      commandement: { id: formData.commandement }
    };

    const res = await addCommune(payload);
    setCommunes(prev => [...prev, res.data]);
    setFormData(prev => ({ ...prev, commune: res.data.id_commune || res.data.id }));
    setDisplayLabels(prev => ({ ...prev, commune: res.data.nom_commune_fr }));

    setShowAddCommune(false);
    setNewCommune({ nom_commune_ar: '', nom_commune_fr: '' });

    Swal.fire("Succès", "Commune ajoutée", "success");

  } catch (err) {
    console.error(err);
    Swal.fire("Erreur", "Serveur error", "error");
  }
};






  const handleQuartierChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ ...prev, quartier: id, secteur: '' }));
    setDisplayLabels(prev => ({ ...prev, quartier: name, secteur: '' }));

    setSecteurs([]);

    if(id) {
      try {
        const res = await getSecteursByQuartier(id);
        setSecteurs(Array.isArray(res.data) ? res.data : []);
      } catch(err){ console.error(err); }
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
  // ::::::::::::

//  if (formValues) {
//   try {
//     const res = await addQuartier({
//       nom_quartier_fr: formValues.nom_quartier_fr,
//       nom_quartier_ar: formValues.nom_quartier_ar,
//       communeId: formData.commune   // 🔥 هذا هو المهم
//     });

//     // بدل هادي (باش ما يدخلش null)
//     setQuartiers(res.data ? prev => [...prev, res.data] : prev => prev);

//     Swal.fire('Succès !', 'Le quartier a été ajouté.', 'success');
//   } catch (err) {
//     Swal.fire('Erreur', "Échec de l'ajout au serveur", 'error');
//   }
// }


// }

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







console.log("quartiers:", quartiers);
console.log("secteurs:", secteurs);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-700 p-10 text-white relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tight">l'ADRESSAGE</h1>
            <p className="text-indigo-200 mt-2">Gestion Intelligente du Découpage Administratif</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Nom</label>
              <input name="nom" value={formData.nom} onChange={handleChange} placeholder="EL OMARI" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
              <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="YASSINE" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
            </div>
             {/* CIN + TELEPHONE */}
{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">CIN</label>
    <input
      name="cin"
      value={formData.cin}
      onChange={handleChange}
      placeholder="AB123456"
      className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
    <input
      type="tel"
      name="telephone"
      value={formData.telephone}
      onChange={handleChange}
      placeholder="06 12 34 56 78"
      className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
  </div>



  {/* DATE + ADRESSE */}
 
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Date de naissance</label>
      <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange}
        className="w-full p-4 bg-gray-50 rounded-2xl ring-1 ring-gray-200 focus:ring-indigo-500" />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse</label>
      <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Quartier, Ville, Pays"
        className="w-full p-4 bg-gray-50 rounded-2xl ring-1 ring-gray-200 focus:ring-indigo-500" />
    </div>
  </div>

  <hr className="border-gray-100"/>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Région */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Région</label>
              <select name="region" value={formData.region} onChange={handleRegionChange}     className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all shadow-sm" >

                <option value="">-- Région --</option>
                {regions.map(r => <option key={r.id_region} value={r.id_region}>{r.nom_region_fr} | {r.nom_region_ar}</option>)}
              </select>
            </div>

            {/* Province */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Province</label>
         <select name="province" value={formData.province} onChange={handleProvinceChange} disabled={!formData.region} className="w-full p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50">            
         <option value="">-- Province --</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.nom_province_fr} | {p.nom_province_ar}</option>)}
              </select>
            </div>

            {/* Pachalik */}
           <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Pachalik</label>
              <select name="pachalik" value={formData.pachalik} onChange={handlePachalikChange}disabled={!formData.province}     className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all shadow-sm" >  
                <option value="">-- Pachalik --</option>
                {pachaliks.map(pk => <option key={pk.id} value={pk.id}>{pk.nom_pachalik_fr} | {pk.nom_pachalik_ar}</option>)}
              </select>
            </div> 










             {/* Commandement */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Commandement</label>
              <select name="commandement" value={formData.commandement} onChange={handleCommandementChange}disabled={!formData.pachalik}     className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all shadow-sm" >

                <option value="">-- Commandement --</option>
                {commandements.map(cmd => <option key={cmd.id} value={cmd.id}>{cmd.nom_commandement_fr} | {cmd.nom_commandement_ar}</option>)}
              </select>
            </div>

            {/* Commune
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Commune</label>
              <select name="commune" value={formData.commune} onChange={handleCommuneChange} disabled={!formData.commandement}     className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all shadow-sm" >

                <option value="">-- Commune --</option>
                {communes.map(c => <option key={c.id} value={c.id}>{c.nom_commune_fr} | {c.nom_commune_ar}</option>)}
              </select>
            </div> */}
            {/* Commune */}






{/* MODAL ADD COMMUNE */}
{showAddCommune && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl">

      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Ajouter une Commune
      </h2>

      <input
        type="text"
        placeholder="Nom Commune (FR)"
        value={newCommune.nom_commune_fr}
        onChange={(e) => setNewCommune({ ...newCommune, nom_commune_fr: e.target.value })}
        className="w-full p-3 mb-3 border rounded-lg"
      />

      <input
        type="text"
        placeholder="Nom Commune (AR)"
        value={newCommune.nom_commune_ar}
        onChange={(e) =>
          setNewCommune({ ...newCommune, nom_commune_ar: e.target.value })
        }
        className="w-full p-3 mb-4 border rounded-lg text-right"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowAddCommune(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Annuler
        </button>
        <button
          onClick={handleAddCommune}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
)}











    <div className="flex flex-col space-y-2">

  <div className="flex items-center justify-between">
    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
      Commune
    </label>

    {communes.length === 0 && formData.commandement && (
      <button
        type="button"
        onClick={() => setShowAddCommune(true)}
        className="w-7 h-7 flex items-center justify-center rounded-full 
                   bg-indigo-100 text-indigo-700 font-bold 
                   hover:bg-indigo-200 transition"
      >
        +
      </button>
    )}
  </div>

  <select
    name="commune"
    value={formData.commune}
    onChange={handleCommuneChange}
    disabled={!formData.commandement}
    className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl 
               text-gray-900 font-semibold focus:border-indigo-500"
  >
    <option value="">-- Commune --</option>
    {communes.map(c => (
      <option key={c.idCommune} value={c.idCommune}>
        {c.nom_commune_fr} | {c.nom_commune_ar}
      </option>
    ))}
  </select>

</div>










            {/* مثال لـ Quartier */}
<div className="flex flex-col space-y-2">
  <div className="flex justify-between items-center">
    <label className="text-sm font-bold text-gray-400 uppercase">Quartier</label>
    <button 
      type="button"
      onClick={handleAddQuartier}
      className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition-colors shadow-sm"
    > + </button>
  </div>
  <select 
  name="quartier" 
  value={formData.quartier} 
  onChange={handleQuartierChange}
  disabled={!formData.commune}
  className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl text-black font-bold shadow-sm outline-none focus:border-indigo-500"
>
  <option value="" className="text-gray-400">-- Choisir Quartier --</option>
  {(quartiers || [])
  .filter(q => q && q.id_quartier)
  .map(q => (
    <option key={q.id_quartier} value={q.id_quartier} className="text-black">
      {q.nom_quartier_fr} | {q.nom_quartier_ar}
    </option>
))}
</select>
 
</div>
{/* /////////////////////////// */}

<div className="flex flex-col space-y-2">
  <div className="flex justify-between items-center">
    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
      Secteur
    </label>
    {/* Bouton "+" pour ajouter un secteur */}
    <button 
      type="button"
      onClick={handleAddSecteur}
      className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition-colors shadow-sm"
      title="Ajouter un secteur"
    >
      <span className="text-lg font-bold">+</span>
    </button>
  </div>
  
  <div className="relative">
    <select 
      name="secteur" 
      value={formData.secteur} 
      onChange={handleSecteurChange} 
      disabled={!formData.quartier} 
      className={`w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold focus:border-indigo-500 outline-none transition-all shadow-sm ${
        !formData.quartier ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <option value="">-- Secteur --</option>
      {secteurs.map(s => (
        <option key={s.id} value={s.id}>
          {s.nom_secteur_fr}
        </option>
      ))}
    </select>

    {/* Icône de flèche pour le style */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
</div>
          </div>




          <ValidationButton loading={loading}/>
        </form>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <LocationSum data={formData} labels={displayLabels}/>
      </div>
    </div>
  );
};

export default RegisterPage;