import { useState } from 'react';
import { BasicTypes, BasicFunctions } from './typescript';
import { DataTypes } from './components/exercises/DataTypes';
import { Arrays } from './components/exercises/Arrays';
import { Calculator } from './components/exercises/Calculator';
import { DateManager } from './components/exercises/DateManager';
import { Database } from './components/exercises/Database';
import { AdvancedExample } from './components/exercises/AdvancedExample';
import { PokemonAPI } from './components/exercises/PokemonAPI';
import { UseStateExamples } from './components/exercises/UseStateExamples';

type ActiveComponent =
  | 'home'
  | 'functions'
  | 'usestate'
  | 'datatypes'
  | 'arrays'
  | 'calculator'
  | 'dates'
  | 'database'
  | 'advanced'
  | 'pokemon';

function App() {
  const [activeComponent, setActiveComponent] =
    useState<ActiveComponent>('home');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'functions':
        return <BasicFunctions />;
      case 'usestate':
        return <UseStateExamples />;
      case 'datatypes':
        return <DataTypes />;
      case 'arrays':
        return <Arrays />;
      case 'calculator':
        return <Calculator />;
      case 'dates':
        return <DateManager />;
      case 'database':
        return <Database />;
      case 'advanced':
        return <AdvancedExample />;
      case 'pokemon':
        return <PokemonAPI />;
      default:
        return (
          <>
            <h1
              className="main-title"
              style={{
                color: '#ffffff',
                textShadow: '1px 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              Introducción a React
            </h1>
            <p className="main-desc main-text" style={{ color: '#ffffff' }}>
              React es una biblioteca de JavaScript para construir interfaces de
              usuario.
            </p>
            <BasicTypes />
          </>
        );
    }
  };

  return (
    <>
      {/* Menú personalizado Bootstrap */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark mb-4"
        style={{
          padding: '1rem 0',
          width: '100vw',
          margin: 0,
          borderRadius: 0,
          left: 0,
          right: 0,
        }}
      >
        <div
          className="container-fluid"
          style={{
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
        >
          <button
            className="navbar-brand fs-3 btn btn-link text-decoration-none"
            style={{
              color: 'white',
              border: 'none',
              background: 'none',
              padding: 0,
            }}
            onClick={() => setActiveComponent('home')}
          >
            React Foundation
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'home' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('home')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'functions' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('functions')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Funciones
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'usestate' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('usestate')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  useState
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'datatypes' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('datatypes')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Tipos de Datos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'arrays' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('arrays')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Arrays
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'calculator' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('calculator')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Calculadora
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'dates' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('dates')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Fechas
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'database' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('database')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Base de Datos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'advanced' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('advanced')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  Ejemplo Avanzado
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${activeComponent === 'pokemon' ? 'active' : ''}`}
                  onClick={() => setActiveComponent('pokemon')}
                  style={{ color: 'white', border: 'none', background: 'none' }}
                >
                  PokéAPI
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>{renderActiveComponent()}</main>
    </>
  );
}

export default App;
