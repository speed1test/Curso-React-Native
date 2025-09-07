import { useState } from 'react';
import './DataTypes.css';

export const DataTypes = () => {
  const [stringValue, setStringValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number>(0);
  const [booleanValue, setBooleanValue] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const testString = () => {
    const length = stringValue.length;
    const upperCase = stringValue.toUpperCase();
    addResult(
      `String: "${stringValue}" - Longitud: ${length} - Mayúsculas: "${upperCase}"`
    );
  };

  const testNumber = () => {
    const isEven = numberValue % 2 === 0;
    const squared = numberValue ** 2;
    addResult(
      `Número: ${numberValue} - Es par: ${isEven} - Al cuadrado: ${squared}`
    );
  };

  const testBoolean = () => {
    addResult(`Boolean: ${booleanValue} - Opuesto: ${!booleanValue}`);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="data-types-container">
      <h2>Ejercicios con Tipos de Datos</h2>

      <div className="exercise-section">
        <h3>1. Strings</h3>
        <input
          type="text"
          placeholder="Escribe un texto..."
          value={stringValue}
          onChange={e => setStringValue(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={testString} className="btn btn-primary">
          Probar String
        </button>
      </div>

      <div className="exercise-section">
        <h3>2. Numbers</h3>
        <input
          type="number"
          placeholder="Escribe un número..."
          value={numberValue}
          onChange={e => setNumberValue(Number(e.target.value))}
          className="form-control mb-2"
        />
        <button onClick={testNumber} className="btn btn-success">
          Probar Número
        </button>
      </div>

      <div className="exercise-section">
        <h3>3. Booleans</h3>
        <div className="form-check">
          <input
            type="checkbox"
            checked={booleanValue}
            onChange={e => setBooleanValue(e.target.checked)}
            className="form-check-input"
            id="booleanCheck"
          />
          <label className="form-check-label" htmlFor="booleanCheck">
            Valor Boolean: {booleanValue.toString()}
          </label>
        </div>
        <button onClick={testBoolean} className="btn btn-warning">
          Probar Boolean
        </button>
      </div>

      <div className="results-section">
        <h3>Resultados:</h3>
        <div className="results-box">
          {results.length === 0 ? (
            <p>No hay resultados aún...</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="result-item">
                {result}
              </div>
            ))
          )}
        </div>
        <button onClick={clearResults} className="btn btn-danger mt-2">
          Limpiar Resultados
        </button>
      </div>
    </div>
  );
};
