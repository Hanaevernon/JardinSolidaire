import React from 'react';

const SelectField = ({ name, value, onChange, options }) => {
  const styles = {
    wrapper: {
      marginBottom: '20px',
    },
    select: {
      width: '100%',
      padding: '14px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
      backgroundColor: '#fff',
    },
  };

  return (
    <div style={styles.wrapper}>
      <select name={name} value={value} onChange={onChange} required style={styles.select}>
        <option value="">-- Choisissez votre rôle --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;

