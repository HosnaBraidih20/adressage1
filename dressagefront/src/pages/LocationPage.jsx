import React, { useState, useEffect } from 'react';
import { 
  Map, MapPin, Building2, Landmark, ListTree, 
  Home, Building, Layers, ShieldCheck 
} from 'lucide-react';
import * as api from '../services/api';

const LocationPage = () => {
  // 1. Mise à jour de l'état pour les 7 niveaux
  const [stats, setStats] = useState({
    regions: 0,
    provinces: 0,
    pachaliks: 0,
    communes: 0,
    commandements: 0,
    quartiers: 0,
    secteurs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getRegions();
        setStats(prev => ({ ...prev, regions: res.data.length }));
        // Tu pourras ajouter ici les autres appels API au fur et à mesure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-all hover:-translate-y-1">
      <div className={`p-3 rounded-2xl ${color} shadow-lg shadow-${color.split('-')[1]}-200`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{title}</p>
        <h4 className="text-xl font-black text-slate-800">{count}</h4>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">
            DASHBOARD <span className="text-indigo-600">STRUCTURE</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm">Hiérarchie complète du découpage administratif</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-100">
          <Map size={20} />
          <span>Explorer la Carte</span>
        </button>
      </div>

      {/* 2. Grille de Statistiques (7 Cartes) */}
      {/* On utilise grid-cols-2 ou 4 selon l'écran pour que ça respire */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard title="Régions" count={stats.regions} icon={Landmark} color="bg-blue-600" />
        <StatCard title="Provinces" count={stats.provinces || '--'} icon={Layers} color="bg-cyan-600" />
        <StatCard title="Pachaliks" count={stats.pachaliks || '--'} icon={Building2} color="bg-indigo-600" />
        <StatCard title="Communes" count={stats.communes || '--'} icon={Home} color="bg-violet-600" />
        <StatCard title="Command." count={stats.commandements || '--'} icon={ShieldCheck} color="bg-purple-600" />
        <StatCard title="Quartiers" count={stats.quartiers || '--'} icon={Building} color="bg-fuchsia-600" />
        <StatCard title="Secteurs" count={stats.secteurs || '--'} icon={MapPin} color="bg-emerald-500" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <ListTree className="text-indigo-600" size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Visualisation de l'Arborescence</h3>
          </div>
        </div>

        <div className="p-8 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Initialisation...</p>
            </div>
          ) : (
            <div className="w-full">
              <p className="italic text-slate-400 text-sm mb-6 border-l-4 border-indigo-200 pl-4">
                Consultez la répartition par niveau administratif en sélectionnant un élément.
              </p>
              
              {/* Exemple de ligne de donnée */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-5 bg-white rounded-2xl border border-slate-100 flex justify-between items-center hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">13</div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase text-sm tracking-tight">Casablanca-Settat</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Région Economique</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">9 Provinces</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase">24 Pachaliks</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;