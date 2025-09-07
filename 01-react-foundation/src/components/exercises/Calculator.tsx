import { useState } from 'react';
import './Calculator.css';

export const Calculator = () => {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Mantener solo las últimas 10 operaciones
  };

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);

      // Agregar al historial
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      addToHistory(calculation);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;

      addToHistory(calculation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleSquareRoot = () => {
    const value = Math.sqrt(parseFloat(display));
    const calculation = `√${display} = ${value}`;
    addToHistory(calculation);
    setDisplay(String(value));
  };

  const handleSquare = () => {
    const inputValue = parseFloat(display);
    const value = inputValue * inputValue;
    const calculation = `${inputValue}² = ${value}`;
    addToHistory(calculation);
    setDisplay(String(value));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator-container">
      <h2>Calculadora Avanzada</h2>

      <div className="calculator-layout">
        <div className="calculator">
          <div className="calculator-display">
            <div className="display-text">{display}</div>
            {operation && previousValue !== null && (
              <div className="operation-indicator">
                {previousValue} {operation}
              </div>
            )}
          </div>

          <div className="calculator-buttons">
            <button onClick={clear} className="btn btn-danger calculator-btn">
              C
            </button>
            <button
              onClick={handlePercentage}
              className="btn btn-secondary calculator-btn"
            >
              %
            </button>
            <button
              onClick={handleSquareRoot}
              className="btn btn-secondary calculator-btn"
            >
              √
            </button>
            <button
              onClick={handleSquare}
              className="btn btn-secondary calculator-btn"
            >
              x²
            </button>

            <button
              onClick={() => inputNumber('7')}
              className="btn btn-light calculator-btn"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="btn btn-light calculator-btn"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="btn btn-light calculator-btn"
            >
              9
            </button>
            <button
              onClick={() => performOperation('/')}
              className="btn btn-warning calculator-btn"
            >
              ÷
            </button>

            <button
              onClick={() => inputNumber('4')}
              className="btn btn-light calculator-btn"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="btn btn-light calculator-btn"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="btn btn-light calculator-btn"
            >
              6
            </button>
            <button
              onClick={() => performOperation('*')}
              className="btn btn-warning calculator-btn"
            >
              ×
            </button>

            <button
              onClick={() => inputNumber('1')}
              className="btn btn-light calculator-btn"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="btn btn-light calculator-btn"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="btn btn-light calculator-btn"
            >
              3
            </button>
            <button
              onClick={() => performOperation('-')}
              className="btn btn-warning calculator-btn"
            >
              -
            </button>

            <button
              onClick={() => inputNumber('0')}
              className="btn btn-light calculator-btn calculator-btn-wide"
            >
              0
            </button>
            <button onClick={inputDot} className="btn btn-light calculator-btn">
              .
            </button>
            <button
              onClick={() => performOperation('+')}
              className="btn btn-warning calculator-btn"
            >
              +
            </button>

            <button
              onClick={handleEquals}
              className="btn btn-success calculator-btn calculator-btn-tall"
            >
              =
            </button>
          </div>
        </div>

        <div className="calculator-history">
          <h3>Historial</h3>
          <div className="history-content">
            {history.length === 0 ? (
              <p>No hay operaciones aún...</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="history-item">
                  {item}
                </div>
              ))
            )}
          </div>
          <button onClick={clearHistory} className="btn btn-danger btn-sm">
            Limpiar Historial
          </button>
        </div>
      </div>
    </div>
  );
};
