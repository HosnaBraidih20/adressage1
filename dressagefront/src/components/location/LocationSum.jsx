import React from 'react';

const LocationSummary = ({ data, labels }) => {
  const steps = [
    { key: 'region', label: 'Région' },
    { key: 'province', label: 'Province' },
    { key: 'pachalik', label: 'Pachalik' },
    { key: 'commune', label: 'Commune' },
    { key: 'commandement', label: 'Commandement' },
    { key: 'quartier', label: 'Quartier' },
    { key: 'secteur', label: 'Secteur' },
  ];

  return (
    /* Beddelna grid b flex flex-wrap bach les éléments yakhdou blassa kfaya */
    <div className="flex flex-wrap justify-center gap-4 text-center mt-6">
      {steps.map(({ key, label }) => (
        <div 
          key={key} 
          /* min-w-[150px] katkhli kol box ikon 3rid chwiya (150px au minimum) */
          className="flex flex-col items-center flex-1 min-w-[160px] max-w-[220px]"
        >
          <span className="text-[12px] font-black text-indigo-500 uppercase tracking-tighter mb-1">
            {label}
          </span>
          <div className="w-full bg-gray-100/80 border border-gray-200 rounded-xl py-3 px-2 text-gray-800 text-xs font-bold shadow-sm">
            {/* whitespace-nowrap bach l'ktba mat9te3ch (dir ... ila kant twila) */}
            <p className="truncate">
              {labels[key] || `-- ${label} --`}
            </p>
          </div>
        </div>




      ))}
    </div>




  );
};

export default LocationSummary;