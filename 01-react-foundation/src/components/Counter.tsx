import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);
  const setValue = (value: number) => setCount(value);

  const handleSetValue = () => {
    const input = document.querySelector('#counter-input') as HTMLInputElement;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      setValue(value);
      input.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(value)) {
        setValue(value);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      maxWidth: '300px',
      margin: '0 auto'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>
        Contador Personalizado
      </h3>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        margin: '20px 0',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '10px',
        borderRadius: '8px'
      }}>
        {count}
      </div>
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={increment}
          style={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          +1
        </button>
        <button 
          onClick={decrement}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          -1
        </button>
        <button 
          onClick={reset}
          style={{
            background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Reset
        </button>
      </div>
      <div style={{ marginTop: '15px' }}>
        <input
          id="counter-input"
          type="number"
          placeholder="Establecer valor"
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            marginRight: '10px',
            width: '120px'
          }}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSetValue}
          style={{
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Set
        </button>
      </div>
    </div>
  );
};