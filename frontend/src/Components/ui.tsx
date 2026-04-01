import React from "react";







/*export function Select({ 
  id,
  value, 
  onChange,
  className = "",
  options, 
 

}: { 
  options: { label: string; value: string }[]; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${className}`}
    >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        
    </select>
  );
}*/

export function Slider({
  min = 0,
  max = 100,
  value,
  onChange,
  className = "",
  id
}: {
  min?: number;
  max?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}) {


  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 ${className}`}
    />
  );


}

export function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  id
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
}

