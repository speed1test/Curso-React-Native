import { useState, useCallback } from 'react';

// Interfaces para tipado TypeScript
interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturn {
  count: number;
  increment: (amount?: number) => void;
  decrement: (amount?: number) => void;
  reset: () => void;
  setValue: (value: number) => void;
  isAtMin: boolean;
  isAtMax: boolean;
  canIncrement: boolean;
  canDecrement: boolean;
  incrementByTen: () => void;
  decrementByTen: () => void;
  double: () => void;
  half: () => void;
}

/**
 * Custom Hook para manejar un contador con múltiples funcionalidades
 * @param {number} initialValue - Valor inicial del contador (default: 0)
 * @param {UseCounterOptions} options - Opciones de configuración
 * @param {number} options.min - Valor mínimo permitido
 * @param {number} options.max - Valor máximo permitido
 * @param {number} options.step - Paso de incremento/decremento (default: 1)
 * @returns {UseCounterReturn} Objeto con el valor del contador y funciones para manipularlo
 */
export const useCounter = (
  initialValue: number = 0, 
  options: UseCounterOptions = {}
): UseCounterReturn => {
  const { min, max, step = 1 } = options;
  
  // Función para validar si un valor está dentro de los límites
  const validateValue = useCallback((value: number): number => {
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
  }, [min, max]);

  // Estado del contador con valor inicial validado
  const [count, setCount] = useState(() => validateValue(initialValue));

  // Incrementar el contador
  const increment = useCallback((amount: number = step) => {
    setCount((prevCount: number) => validateValue(prevCount + amount));
  }, [step, validateValue]);

  // Decrementar el contador
  const decrement = useCallback((amount: number = step) => {
    setCount((prevCount: number) => validateValue(prevCount - amount));
  }, [step, validateValue]);

  // Resetear al valor inicial
  const reset = useCallback(() => {
    setCount(validateValue(initialValue));
  }, [initialValue, validateValue]);

  // Establecer un valor específico
  const setValue = useCallback((value: number) => {
    setCount(validateValue(value));
  }, [validateValue]);

  // Funciones de utilidad
  const isAtMin = min !== undefined && count <= min;
  const isAtMax = max !== undefined && count >= max;

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    isAtMin,
    isAtMax,
    // Funciones adicionales
    canIncrement: !isAtMax,
    canDecrement: !isAtMin,
    // Para casos especiales
    incrementByTen: () => increment(10),
    decrementByTen: () => decrement(10),
    double: () => setValue(count * 2),
    half: () => setValue(Math.floor(count / 2))
  };
};