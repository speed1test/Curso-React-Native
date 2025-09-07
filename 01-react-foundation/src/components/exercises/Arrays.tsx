import { useState } from 'react';
import './Arrays.css';

export const Arrays = () => {
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4, 5]);
  const [fruits, setFruits] = useState<string[]>([
    'Manzana',
    'Plátano',
    'Naranja',
  ]);
  const [newNumber, setNewNumber] = useState<string>('');
  const [newFruit, setNewFruit] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const addNumber = () => {
    if (newNumber.trim() && !isNaN(Number(newNumber))) {
      setNumbers(prev => [...prev, Number(newNumber)]);
      setNewNumber('');
      addResult(`Número ${newNumber} agregado al array`);
    }
  };

  const addFruit = () => {
    if (newFruit.trim()) {
      setFruits(prev => [...prev, newFruit.trim()]);
      setNewFruit('');
      addResult(`Fruta "${newFruit}" agregada al array`);
    }
  };

  const removeLastNumber = () => {
    if (numbers.length > 0) {
      const removed = numbers[numbers.length - 1];
      setNumbers(prev => prev.slice(0, -1));
      addResult(`Número ${removed} eliminado del array`);
    }
  };

  const removeLastFruit = () => {
    if (fruits.length > 0) {
      const removed = fruits[fruits.length - 1];
      setFruits(prev => prev.slice(0, -1));
      addResult(`Fruta "${removed}" eliminada del array`);
    }
  };

  const calculateSum = () => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    addResult(`Suma de números: ${sum}`);
  };

  const findMax = () => {
    if (numbers.length > 0) {
      const max = Math.max(...numbers);
      addResult(`Número máximo: ${max}`);
    }
  };

  const findMin = () => {
    if (numbers.length > 0) {
      const min = Math.min(...numbers);
      addResult(`Número mínimo: ${min}`);
    }
  };

  const sortNumbers = () => {
    const sorted = [...numbers].sort((a, b) => a - b);
    setNumbers(sorted);
    addResult(`Array de números ordenado: [${sorted.join(', ')}]`);
  };

  const sortFruits = () => {
    const sorted = [...fruits].sort();
    setFruits(sorted);
    addResult(`Array de frutas ordenado alfabéticamente`);
  };

  const filterEvenNumbers = () => {
    const evenNumbers = numbers.filter(num => num % 2 === 0);
    addResult(`Números pares: [${evenNumbers.join(', ')}]`);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="arrays-container">
      <h2>Ejercicios con Arrays</h2>

      <div className="arrays-display">
        <div className="array-section">
          <h3>Array de Números</h3>
          <div className="array-content">[{numbers.join(', ')}]</div>
          <div className="array-controls">
            <input
              type="number"
              placeholder="Nuevo número..."
              value={newNumber}
              onChange={e => setNewNumber(e.target.value)}
              className="form-control"
            />
            <button onClick={addNumber} className="btn btn-primary">
              Agregar
            </button>
            <button onClick={removeLastNumber} className="btn btn-danger">
              Eliminar Último
            </button>
          </div>
        </div>

        <div className="array-section">
          <h3>Array de Frutas</h3>
          <div className="array-content">
            [{fruits.map(fruit => `"${fruit}"`).join(', ')}]
          </div>
          <div className="array-controls">
            <input
              type="text"
              placeholder="Nueva fruta..."
              value={newFruit}
              onChange={e => setNewFruit(e.target.value)}
              className="form-control"
            />
            <button onClick={addFruit} className="btn btn-primary">
              Agregar
            </button>
            <button onClick={removeLastFruit} className="btn btn-danger">
              Eliminar Última
            </button>
          </div>
        </div>
      </div>

      <div className="operations-section">
        <h3>Operaciones con Arrays</h3>
        <div className="operation-buttons">
          <button onClick={calculateSum} className="btn btn-success">
            Sumar Números
          </button>
          <button onClick={findMax} className="btn btn-info">
            Máximo
          </button>
          <button onClick={findMin} className="btn btn-info">
            Mínimo
          </button>
          <button onClick={sortNumbers} className="btn btn-warning">
            Ordenar Números
          </button>
          <button onClick={sortFruits} className="btn btn-warning">
            Ordenar Frutas
          </button>
          <button onClick={filterEvenNumbers} className="btn btn-secondary">
            Filtrar Pares
          </button>
        </div>
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
