import React from 'react';

const SelectField = ({ label, name, options, onChange, value }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none shadow-sm"
    >
      <option value="">-- {label} --</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

export default SelectField;