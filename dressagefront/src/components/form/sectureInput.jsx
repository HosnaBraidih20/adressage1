import React from 'react';
import { Layers } from 'lucide-react';

const SectureInput = ({ options, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col space-y-2 group">
      {/* Label b style nqi */}
      <div className="flex items-center space-x-2 ml-1">
        <Layers size={14} className={disabled ? "text-gray-300" : "text-indigo-500"} />
        <label className={`text-xs font-bold uppercase tracking-widest ${disabled ? "text-gray-300" : "text-gray-500 group-focus-within:text-indigo-600 transition-colors"}`}>
          Secteur / Cercle
        </label>
      </div>

      <div className="relative">
        <select
          name="secteur"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full p-4 bg-white rounded-2xl border-2 outline-none transition-all appearance-none cursor-pointer
            ${disabled 
              ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" 
              : "border-gray-100 hover:border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:shadow-md"
            }
          `}
        >
          <option value="">
            {disabled ? "--- En attente du Pachalik ---" : "Choisir un secteur..."}
          </option>
          
          {options && options.map((opt) => (
            <option key={opt.id} value={opt.id} className="text-gray-800">
              {opt.name}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon bach maybanich bhal select d l'Windows l'qdima */}
        {!disabled && (
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Helper text ila kanti bagha t-explaini chi haja */}
      {!disabled && !value && (
        <span className="text-[10px] text-indigo-400 ml-1 italic animate-pulse">
          * Veuillez sélectionner un secteur pour voir les quartiers
        </span>
      )}
    </div>
  );
};

export default SectureInput;