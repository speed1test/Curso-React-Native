import { useState, useCallback } from 'react';

// Interface for useCounter hook
export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

// Custom hook with arguments and return values
export const useCounter = (
  initialValue: number = 0,
  step: number = 1
): UseCounterReturn => {
  const [count, setCount] = useState<number>(initialValue);

  // Functions with useCallback for optimization
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prevCount => prevCount - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
};
