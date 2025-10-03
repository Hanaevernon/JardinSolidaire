import React from 'react';

const InputField = ({ type, name, value, onChange, placeholder }) => {
  const styles = {
    wrapper: {
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
    },
  };

  return (
    <div style={styles.wrapper}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={styles.input}
      />
    </div>
  );
};

export default InputField;
