import React, { useState } from 'react';
import './BasicFunctions.css';

// 1. Función básica con parámetros tipados
function greetUser(name: string, age: number): string {
  return `Hola ${name}, tienes ${age} años`;
}

// 2. Función arrow con tipo de retorno
const calculateArea = (width: number, height: number): number => {
  return width * height;
};

// 3. Función con parámetros opcionales
const createMessage = (message: string, prefix?: string): string => {
  return prefix ? `${prefix}: ${message}` : message;
};

// 4. Función con parámetros por defecto
function calculateDiscount(price: number, discount: number = 0.1): number {
  return price - (price * discount);
}

// 5. Función que retorna un objeto
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (name: string, email: string): User => {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email
  };
};

// 6. Función con múltiples tipos de retorno (Union Types)
const processValue = (value: string | number): string => {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toString();
};

// 7. Función de orden superior (que recibe otra función como parámetro)
const applyOperation = (
  a: number, 
  b: number, 
  operation: (x: number, y: number) => number
): number => {
  return operation(a, b);
};

// Operaciones para usar con la función de orden superior
const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const subtract = (a: number, b: number): number => a - b;

// 8. Función async/await
const fetchUserData = async (userId: number): Promise<User | null> => {
  try {
    // Simulamos una llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: userId,
      name: `Usuario ${userId}`,
      email: `user${userId}@example.com`
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Componente React que demuestra el uso de funciones
export const BasicFunctions: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Función del componente para manejar cálculos
  const handleCalculations = (): void => {
    const greeting = greetUser('Ana', 25);
    const area = calculateArea(10, 5);
    const messageWithPrefix = createMessage('Bienvenido', 'INFO');
    const messageWithoutPrefix = createMessage('Hola mundo');
    const discountedPrice = calculateDiscount(100);
    const discountedPriceCustom = calculateDiscount(100, 0.2);
    
    const newUser = createUser('Carlos', 'carlos@example.com');
    
    const processedString = processValue('hello');
    const processedNumber = processValue(42);
    
    const addResult = applyOperation(10, 5, add);
    const multiplyResult = applyOperation(10, 5, multiply);
    const subtractResult = applyOperation(10, 5, subtract);

    const results = `
      Saludo: ${greeting}
      Área: ${area}
      Mensaje con prefijo: ${messageWithPrefix}
      Mensaje sin prefijo: ${messageWithoutPrefix}
      Precio con descuento por defecto (10%): $${discountedPrice}
      Precio con descuento personalizado (20%): $${discountedPriceCustom}
      Usuario creado: ${newUser.name} (${newUser.email})
      Proceso string: ${processedString}
      Proceso número: ${processedNumber}
      Suma: ${addResult}
      Multiplicación: ${multiplyResult}
      Resta: ${subtractResult}
    `;

    setResult(results);
  };

  // Función async para obtener datos de usuario
  const handleFetchUser = async (): Promise<void> => {
    setLoading(true);
    const userData = await fetchUserData(123);
    setUser(userData);
    setLoading(false);
  };

  return (
    <div className="basic-functions-container">
      <h2>Ejemplos de Funciones en TypeScript</h2>
      
      <div className="section">
        <h3>Funciones Síncronas</h3>
        <button onClick={handleCalculations} className="btn-primary">
          Ejecutar Ejemplos de Funciones
        </button>
        {result && (
          <div className="result-box">
            <h4>Resultados:</h4>
            <pre>{result}</pre>
          </div>
        )}
      </div>

      <div className="section">
        <h3>Función Asíncrona</h3>
        <button 
          onClick={handleFetchUser} 
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? 'Cargando...' : 'Obtener Datos de Usuario'}
        </button>
        {user && (
          <div className="user-info">
            <h4>Usuario Obtenido:</h4>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>

      <div className="section">
        <h3>Tipos de Funciones Demostradas:</h3>
        <ul className="function-types">
          <li>✅ Funciones con parámetros tipados</li>
          <li>✅ Funciones arrow</li>
          <li>✅ Parámetros opcionales</li>
          <li>✅ Parámetros por defecto</li>
          <li>✅ Funciones que retornan objetos</li>
          <li>✅ Union types en parámetros</li>
          <li>✅ Funciones de orden superior</li>
          <li>✅ Funciones asíncronas</li>
          <li>✅ Manejo de tipos Promise</li>
        </ul>
      </div>
    </div>
  );
};