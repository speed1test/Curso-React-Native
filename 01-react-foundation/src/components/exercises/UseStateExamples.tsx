import React, { useState } from 'react';
import { Counter } from '../Counter';
import { useCounter } from '../../hooks/counter';
import './UseStateExamples.css';

// Interfaces para tipar nuestros estados
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const UseStateExamples: React.FC = () => {
  // 1. useState básico con primitivos
  const [message, setMessage] = useState<string>('¡Hola mundo!');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);

  // 2. useState con objetos
  const [user, setUser] = useState<User>({
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    age: 25
  });

  // 3. useState con arrays
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Aprender React', completed: false },
    { id: 2, text: 'Practicar TypeScript', completed: true },
    { id: 3, text: 'Crear componentes', completed: false }
  ]);

  // 4. useState con formularios
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  // 5. useState con custom hook avanzado
  const basicCounter = useCounter(5, { min: 0, max: 20, step: 2 });
  const limitedCounter = useCounter(10, { min: -5, max: 15 });
  const percentageCounter = useCounter(50, { min: 0, max: 100, step: 5 });

  // 6. useState con estado condicional
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState<boolean>(false);

  // Funciones para manejar los estados

  // Función para actualizar el usuario
  const updateUser = (field: keyof User, value: string | number) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  // Función para agregar una nueva tarea
  const addTodo = () => {
    if (formData.message.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: formData.message.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setFormData(prev => ({ ...prev, message: '' }));
    }
  };

  // Función para marcar tarea como completada
  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Función para eliminar tarea
  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Función para manejar cambios en formulario
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para simular carga asíncrona
  const simulateLoading = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setMessage('¡Datos cargados exitosamente!');
  };

  return (
    <div className={`usestate-container ${theme}`}>
      <h2>Ejemplos de useState en React</h2>

      {/* Sección 1: Estados básicos */}
      <section className="example-section">
        <h3>1. Estados Básicos (Primitivos)</h3>
        
        <div className="example-group">
          <div className="state-demo">
            <h4>String State</h4>
            <p>Mensaje actual: <span className="highlight">{message}</span></p>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              className="input-field"
            />
          </div>

          <div className="state-demo">
            <h4>Boolean State</h4>
            <p>Elemento {isVisible ? 'visible' : 'oculto'}</p>
            <button 
              onClick={() => setIsVisible(!isVisible)}
              className="btn-toggle"
            >
              {isVisible ? 'Ocultar' : 'Mostrar'}
            </button>
            {isVisible && <div className="toggle-element">¡Aquí estoy! 👋</div>}
          </div>

          <div className="state-demo">
            <h4>Number State</h4>
            <p>Contador: <span className="counter-display">{counter}</span></p>
            <div className="button-group">
              <button onClick={() => setCounter(counter + 1)} className="btn-increment">+</button>
              <button onClick={() => setCounter(counter - 1)} className="btn-decrement">-</button>
              <button onClick={() => setCounter(0)} className="btn-reset">Reset</button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Estado con objetos */}
      <section className="example-section">
        <h3>2. Estado con Objetos</h3>
        <div className="user-card">
          <h4>Información del Usuario</h4>
          <div className="user-info-grid">
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => updateUser('name', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => updateUser('email', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label>Edad:</label>
              <input
                type="number"
                value={user.age}
                onChange={(e) => updateUser('age', parseInt(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>
          <div className="user-preview">
            <strong>Vista previa:</strong> {user.name} ({user.age} años) - {user.email}
          </div>
        </div>
      </section>

      {/* Sección 3: Estado con arrays */}
      <section className="example-section">
        <h3>3. Estado con Arrays (Lista de Tareas)</h3>
        <div className="todo-container">
          <div className="add-todo">
            <input
              type="text"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Agregar nueva tarea..."
              className="input-field"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo} className="btn-add">Agregar</button>
          </div>
          
          <div className="todo-list">
            {todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <span 
                  onClick={() => toggleTodo(todo.id)}
                  className="todo-text"
                >
                  {todo.completed ? '✅' : '⭕'} {todo.text}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="btn-delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <p className="todo-stats">
            Total: {todos.length} | Completadas: {todos.filter(t => t.completed).length}
          </p>
        </div>
      </section>

      {/* Sección 4: Custom Hook (ahora componente) */}
      <section className="example-section">
        <h3>4. useState con Componente Reutilizable</h3>
        <div className="custom-hook-demo">
          <p style={{ marginBottom: '20px', textAlign: 'center', color: '#2c3e50' }}>
            Ejemplo de componente reutilizable que encapsula lógica de useState:
          </p>
          <Counter initialValue={10} />
        </div>
      </section>

      {/* Sección 5: Custom Hook Avanzado */}
      <section className="example-section">
        <h3>5. useState con Custom Hook Avanzado</h3>
        <div className="advanced-hooks-container">
          
          {/* Contador Básico con límites */}
          <div className="hook-example">
            <h4>Contador con Límites y Step Personalizado</h4>
            <div className="counter-display-advanced">
              Valor: <span className="count-value">{basicCounter.count}</span>
              <small> (min: 0, max: 20, step: 2)</small>
            </div>
            <div className="button-group-advanced">
              <button 
                onClick={() => basicCounter.increment()} 
                disabled={!basicCounter.canIncrement}
                className={`btn-advanced ${!basicCounter.canIncrement ? 'disabled' : 'increment'}`}
              >
                +{2}
              </button>
              <button 
                onClick={() => basicCounter.decrement()} 
                disabled={!basicCounter.canDecrement}
                className={`btn-advanced ${!basicCounter.canDecrement ? 'disabled' : 'decrement'}`}
              >
                -{2}
              </button>
              <button 
                onClick={basicCounter.reset} 
                className="btn-advanced reset"
              >
                Reset
              </button>
            </div>
            <div className="status-indicators">
              <span className={`status ${basicCounter.isAtMin ? 'active' : ''}`}>
                🔴 En mínimo: {basicCounter.isAtMin ? 'Sí' : 'No'}
              </span>
              <span className={`status ${basicCounter.isAtMax ? 'active' : ''}`}>
                🔴 En máximo: {basicCounter.isAtMax ? 'Sí' : 'No'}
              </span>
            </div>
          </div>

          {/* Contador con rango negativo */}
          <div className="hook-example">
            <h4>Contador con Rango Negativo</h4>
            <div className="counter-display-advanced">
              Valor: <span className="count-value">{limitedCounter.count}</span>
              <small> (min: -5, max: 15)</small>
            </div>
            <div className="button-group-advanced">
              <button 
                onClick={() => limitedCounter.increment()} 
                disabled={!limitedCounter.canIncrement}
                className={`btn-advanced ${!limitedCounter.canIncrement ? 'disabled' : 'increment'}`}
              >
                +1
              </button>
              <button 
                onClick={() => limitedCounter.decrement()} 
                disabled={!limitedCounter.canDecrement}
                className={`btn-advanced ${!limitedCounter.canDecrement ? 'disabled' : 'decrement'}`}
              >
                -1
              </button>
              <button 
                onClick={limitedCounter.incrementByTen} 
                disabled={!limitedCounter.canIncrement}
                className={`btn-advanced ${!limitedCounter.canIncrement ? 'disabled' : 'special'}`}
              >
                +10
              </button>
              <button 
                onClick={limitedCounter.decrementByTen} 
                disabled={!limitedCounter.canDecrement}
                className={`btn-advanced ${!limitedCounter.canDecrement ? 'disabled' : 'special'}`}
              >
                -10
              </button>
            </div>
            <div className="special-actions">
              <button onClick={limitedCounter.double} className="btn-advanced special">
                Doblar
              </button>
              <button onClick={limitedCounter.half} className="btn-advanced special">
                Mitad
              </button>
            </div>
          </div>

          {/* Contador de porcentaje */}
          <div className="hook-example">
            <h4>Contador de Porcentaje</h4>
            <div className="percentage-display">
              <div className="percentage-bar">
                <div 
                  className="percentage-fill" 
                  style={{ width: `${percentageCounter.count}%` }}
                ></div>
              </div>
              <span className="percentage-text">{percentageCounter.count}%</span>
            </div>
            <div className="button-group-advanced">
              <button 
                onClick={() => percentageCounter.increment()} 
                disabled={!percentageCounter.canIncrement}
                className={`btn-advanced ${!percentageCounter.canIncrement ? 'disabled' : 'increment'}`}
              >
                +5%
              </button>
              <button 
                onClick={() => percentageCounter.decrement()} 
                disabled={!percentageCounter.canDecrement}
                className={`btn-advanced ${!percentageCounter.canDecrement ? 'disabled' : 'decrement'}`}
              >
                -5%
              </button>
              <button 
                onClick={() => percentageCounter.setValue(0)} 
                className="btn-advanced reset"
              >
                0%
              </button>
              <button 
                onClick={() => percentageCounter.setValue(100)} 
                className="btn-advanced special"
              >
                100%
              </button>
            </div>
          </div>

        </div>

        {/* Código del hook */}
        <div className="code-example">
          <h4>📝 Código del Custom Hook</h4>
          <pre className="code-block">
{`const basicCounter = useCounter(5, { 
  min: 0, 
  max: 20, 
  step: 2 
});

const limitedCounter = useCounter(10, { 
  min: -5, 
  max: 15 
});

const percentageCounter = useCounter(50, { 
  min: 0, 
  max: 100, 
  step: 5 
});`}
          </pre>
        </div>
      </section>

      {/* Sección 5: Estados condicionales y efectos */}
      <section className="example-section">
        <h3>6. Estados Condicionales y Efectos</h3>
        <div className="conditional-states">
          <div className="theme-switcher">
            <h4>Cambiar Tema</h4>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn-theme"
            >
              Cambiar a tema {theme === 'light' ? 'oscuro' : 'claro'}
            </button>
            <p>Tema actual: <span className="highlight">{theme}</span></p>
          </div>

          <div className="loading-demo">
            <h4>Simulación de Carga</h4>
            <button 
              onClick={simulateLoading}
              disabled={loading}
              className={`btn-load ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Cargando...' : 'Simular Carga'}
            </button>
            {loading && <div className="spinner">⏳</div>}
          </div>
        </div>
      </section>

      {/* Resumen de conceptos */}
      <section className="example-section">
        <h3>📚 Conceptos Demostrados</h3>
        <div className="concepts-grid">
          <div className="concept-card">
            <h4>✅ useState Básico</h4>
            <p>String, Number, Boolean</p>
          </div>
          <div className="concept-card">
            <h4>✅ Estado con Objetos</h4>
            <p>Actualización inmutable</p>
          </div>
          <div className="concept-card">
            <h4>✅ Estado con Arrays</h4>
            <p>Agregar, modificar, eliminar</p>
          </div>
          <div className="concept-card">
            <h4>✅ Custom Hooks</h4>
            <p>Reutilización de lógica</p>
          </div>
          <div className="concept-card">
            <h4>✅ Custom Hooks Avanzados</h4>
            <p>Con límites y validaciones</p>
          </div>
          <div className="concept-card">
            <h4>✅ useCallback</h4>
            <p>Optimización de rendimiento</p>
          </div>
          <div className="concept-card">
            <h4>✅ Estados Condicionales</h4>
            <p>Renderizado condicional</p>
          </div>
          <div className="concept-card">
            <h4>✅ Componentes Reutilizables</h4>
            <p>Encapsulación de lógica</p>
          </div>
          <div className="concept-card">
            <h4>✅ TypeScript</h4>
            <p>Tipado estricto</p>
          </div>
        </div>
      </section>
    </div>
  );
};
