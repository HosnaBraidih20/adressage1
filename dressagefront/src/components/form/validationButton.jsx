
import React from "react";
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

const ValidationButton = ({ loading, isSuccess, disabled = false }) => {
  return (
    <button
      disabled={loading || isSuccess || disabled}
      type="submit"
      className={`
        relative w-full overflow-hidden group
        py-4 px-6 rounded-2xl font-bold text-white
        transition-all duration-500 ease-in-out
        ${isSuccess 
          ? "bg-green-500 shadow-green-200" 
          : loading 
            ? "bg-indigo-400 cursor-wait" 
            : disabled
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 active:scale-95 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
        }
      `}
    >
      <div className="flex items-center justify-center space-x-3">
        {loading ? (
          /* --- L'état dial Chargement (Spinner) --- */
          <div className="flex items-center animate-in zoom-in duration-300">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span className="tracking-wide text-sm font-medium italic">Traitement en cours...</span>
          </div>
        ) : isSuccess ? (
          /* --- L'état dial Succès (Check Mark kima fl'tswira) --- */
          <div className="flex items-center animate-in slide-in-from-bottom-2 duration-500">
            <CheckCircle2 className="w-6 h-6 mr-2" />
            <span className="tracking-widest uppercase text-sm">Inscription Réussie</span>
          </div>
        ) : disabled ? (
          /* --- L'état Disabled (Champs obligatoires non remplis) --- */
          <span className="tracking-widest uppercase text-sm">Remplir tous les champs</span>
        ) : (
          /* --- L'état Normal --- */
          <>
            <span className="tracking-widest uppercase text-sm">Valider l'inscription</span>
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
          </>
        )}
      </div>

      {/* Shine effect (L'm3a) foq l'bouton */}
      {!loading && !isSuccess && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
      )}
    </button>
  );
};

export default ValidationButton;