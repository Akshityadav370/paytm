import React from 'react';

function InputBox({ label, placeholder, value, onChange }) {
  return (
    <div>
      <div className='text-sm font-medium text-left py-2'>{label}</div>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full px-2 py-1 border rounded border-slate-200'
      />
    </div>
  );
}

export default InputBox;
