import { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonAPI.css';

// Interfaces para la PokéAPI
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

interface PokemonSpecies {
  id: number;
  name: string;
  color: {
    name: string;
  };
  habitat: {
    name: string;
  } | null;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface Move {
  id: number;
  name: string;
  accuracy: number;
  power: number;
  pp: number;
  priority: number;
  type: {
    name: string;
  };
  damage_class: {
    name: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
    };
  }>;
}

interface Type {
  id: number;
  name: string;
  damage_relations: {
    double_damage_to: Array<{ name: string }>;
    half_damage_to: Array<{ name: string }>;
    no_damage_to: Array<{ name: string }>;
    double_damage_from: Array<{ name: string }>;
    half_damage_from: Array<{ name: string }>;
    no_damage_from: Array<{ name: string }>;
  };
  pokemon: Array<{
    pokemon: {
      name: string;
    };
    slot: number;
  }>;
}

interface Berry {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  firmness: {
    name: string;
  };
  flavors: Array<{
    potency: number;
    flavor: {
      name: string;
    };
  }>;
}

export const PokemonAPI = () => {
  // Estados para diferentes secciones
  const [activeTab, setActiveTab] = useState<string>('pokemon');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Estados para Pokémon
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies | null>(null);
  const [pokemonSearch, setPokemonSearch] = useState<string>('pikachu');
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Estados para otros endpoints
  const [move, setMove] = useState<Move | null>(null);
  const [moveSearch, setMoveSearch] = useState<string>('thunderbolt');
  const [type, setType] = useState<Type | null>(null);
  const [typeSearch, setTypeSearch] = useState<string>('electric');
  const [berry, setBerry] = useState<Berry | null>(null);
  const [berrySearch, setBerrySearch] = useState<string>('cheri');

  // Base URL de la PokéAPI
  const BASE_URL = 'https://pokeapi.co/api/v2';

  // Función para buscar Pokémon por nombre o ID
  const fetchPokemon = async (nameOrId: string) => {
    setLoading(true);
    setError('');
    try {
      const [pokemonResponse, speciesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/pokemon/${nameOrId.toLowerCase()}`),
        axios.get(`${BASE_URL}/pokemon-species/${nameOrId.toLowerCase()}`)
      ]);
      
      setPokemon(pokemonResponse.data);
      setPokemonSpecies(speciesResponse.data);
    } catch (error) {
      setError(`No se pudo encontrar el Pokémon: ${nameOrId}`);
      setPokemon(null);
      setPokemonSpecies(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener lista de Pokémon con paginación
  const fetchPokemonList = async (offset: number = 0, limit: number = 20) => {
    setLoading(true);
    try {
      const response = await axios.get<PokemonListResponse>(
        `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
      );
      setPokemonList(response.data.results);
      setCurrentPage(offset / limit);
    } catch (error) {
      setError('Error al cargar la lista de Pokémon');
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar movimientos
  const fetchMove = async (nameOrId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BASE_URL}/move/${nameOrId.toLowerCase()}`);
      setMove(response.data);
    } catch (error) {
      setError(`No se pudo encontrar el movimiento: ${nameOrId}`);
      setMove(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar tipos
  const fetchType = async (nameOrId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BASE_URL}/type/${nameOrId.toLowerCase()}`);
      setType(response.data);
    } catch (error) {
      setError(`No se pudo encontrar el tipo: ${nameOrId}`);
      setType(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar bayas
  const fetchBerry = async (nameOrId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BASE_URL}/berry/${nameOrId.toLowerCase()}`);
      setBerry(response.data);
    } catch (error) {
      setError(`No se pudo encontrar la baya: ${nameOrId}`);
      setBerry(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener descripción en español
  const getSpanishDescription = (entries: any[]) => {
    const spanishEntry = entries.find(entry => 
      entry.language.name === 'es' || entry.language.name === 'en'
    );
    return spanishEntry ? spanishEntry.flavor_text.replace(/\n/g, ' ') : 'Descripción no disponible';
  };

  // Función para obtener efecto en inglés
  const getEnglishEffect = (entries: any[]) => {
    const englishEntry = entries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.effect : 'Efecto no disponible';
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchPokemon('pikachu');
    fetchPokemonList(0, 20);
  }, []);

  // Función para manejar búsquedas
  const handleSearch = () => {
    switch (activeTab) {
      case 'pokemon':
        if (pokemonSearch.trim()) {
          fetchPokemon(pokemonSearch.trim());
        }
        break;
      case 'moves':
        if (moveSearch.trim()) {
          fetchMove(moveSearch.trim());
        }
        break;
      case 'types':
        if (typeSearch.trim()) {
          fetchType(typeSearch.trim());
        }
        break;
      case 'berries':
        if (berrySearch.trim()) {
          fetchBerry(berrySearch.trim());
        }
        break;
    }
  };

  // Función para generar Pokémon aleatorio
  const getRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Gen 1-9
    setPokemonSearch(randomId.toString());
    fetchPokemon(randomId.toString());
  };

  // Render del contenido de Pokémon
  const renderPokemonContent = () => (
    <div className="pokemon-section">
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={pokemonSearch}
            onChange={(e) => setPokemonSearch(e.target.value)}
            placeholder="Buscar Pokémon (nombre o ID)"
            className="form-control"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Buscar
          </button>
          <button onClick={getRandomPokemon} className="btn btn-secondary">
            Aleatorio
          </button>
        </div>
      </div>

      {pokemon && (
        <div className="pokemon-details">
          <div className="pokemon-header">
            <h3>#{pokemon.id.toString().padStart(3, '0')} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <div className="pokemon-types">
              {pokemon.types.map((type) => (
                <span key={type.slot} className={`type-badge type-${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="pokemon-content">
            <div className="pokemon-sprites">
              <div className="sprite-container">
                <img src={pokemon.sprites.front_default} alt={`${pokemon.name} normal`} />
                <span>Normal</span>
              </div>
              <div className="sprite-container">
                <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`} />
                <span>Shiny</span>
              </div>
            </div>

            <div className="pokemon-info">
              <div className="basic-info">
                <h4>Información Básica</h4>
                <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
                <p><strong>Experiencia Base:</strong> {pokemon.base_experience}</p>
                {pokemonSpecies && pokemonSpecies.habitat && (
                  <p><strong>Hábitat:</strong> {pokemonSpecies.habitat.name}</p>
                )}
                {pokemonSpecies && (
                  <p><strong>Color:</strong> {pokemonSpecies.color.name}</p>
                )}
              </div>

              <div className="abilities">
                <h4>Habilidades</h4>
                {pokemon.abilities.map((ability) => (
                  <div key={ability.slot} className="ability-item">
                    <span className={`ability ${ability.is_hidden ? 'hidden' : ''}`}>
                      {ability.ability.name.replace(/-/g, ' ')}
                      {ability.is_hidden && ' (Oculta)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pokemon-stats">
            <h4>Estadísticas Base</h4>
            <div className="stats-grid">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-item">
                  <span className="stat-name">
                    {stat.stat.name.replace(/-/g, ' ').toUpperCase()}
                  </span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pokemonSpecies && pokemonSpecies.flavor_text_entries.length > 0 && (
            <div className="pokemon-description">
              <h4>Descripción</h4>
              <p>{getSpanishDescription(pokemonSpecies.flavor_text_entries)}</p>
            </div>
          )}
        </div>
      )}

      <div className="pokemon-list">
        <h4>Lista de Pokémon</h4>
        <div className="pagination-controls">
          <button 
            onClick={() => fetchPokemonList((currentPage - 1) * 20, 20)}
            disabled={currentPage === 0}
            className="btn btn-outline-primary"
          >
            Anterior
          </button>
          <span>Página {currentPage + 1}</span>
          <button 
            onClick={() => fetchPokemonList((currentPage + 1) * 20, 20)}
            className="btn btn-outline-primary"
          >
            Siguiente
          </button>
        </div>
        <div className="pokemon-grid">
          {pokemonList.map((pokemon, index) => (
            <div 
              key={pokemon.name} 
              className="pokemon-card"
              onClick={() => {
                setPokemonSearch(pokemon.name);
                fetchPokemon(pokemon.name);
              }}
            >
              <span>#{(currentPage * 20 + index + 1).toString().padStart(3, '0')}</span>
              <span>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render del contenido de movimientos
  const renderMovesContent = () => (
    <div className="moves-section">
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={moveSearch}
            onChange={(e) => setMoveSearch(e.target.value)}
            placeholder="Buscar movimiento (nombre o ID)"
            className="form-control"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Buscar
          </button>
        </div>
      </div>

      {move && (
        <div className="move-details">
          <h3>{move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, ' ')}</h3>
          
          <div className="move-info-grid">
            <div className="move-basic-info">
              <h4>Información Básica</h4>
              <p><strong>Tipo:</strong> <span className={`type-badge type-${move.type.name}`}>{move.type.name}</span></p>
              <p><strong>Clase:</strong> {move.damage_class.name}</p>
              <p><strong>Poder:</strong> {move.power || 'N/A'}</p>
              <p><strong>Precisión:</strong> {move.accuracy || 'N/A'}%</p>
              <p><strong>PP:</strong> {move.pp}</p>
              <p><strong>Prioridad:</strong> {move.priority}</p>
            </div>

            <div className="move-effect">
              <h4>Efecto</h4>
              <p>{getEnglishEffect(move.effect_entries)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render del contenido de tipos
  const renderTypesContent = () => (
    <div className="types-section">
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
            placeholder="Buscar tipo (nombre o ID)"
            className="form-control"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Buscar
          </button>
        </div>
      </div>

      {type && (
        <div className="type-details">
          <h3>
            Tipo <span className={`type-badge type-${type.name}`}>{type.name}</span>
          </h3>
          
          <div className="type-effectiveness">
            <div className="effectiveness-section">
              <h4>Súper efectivo contra:</h4>
              <div className="type-list">
                {type.damage_relations.double_damage_to.map((target) => (
                  <span key={target.name} className={`type-badge type-${target.name}`}>
                    {target.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="effectiveness-section">
              <h4>No muy efectivo contra:</h4>
              <div className="type-list">
                {type.damage_relations.half_damage_to.map((target) => (
                  <span key={target.name} className={`type-badge type-${target.name}`}>
                    {target.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="effectiveness-section">
              <h4>No afecta a:</h4>
              <div className="type-list">
                {type.damage_relations.no_damage_to.map((target) => (
                  <span key={target.name} className={`type-badge type-${target.name}`}>
                    {target.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="effectiveness-section">
              <h4>Débil contra:</h4>
              <div className="type-list">
                {type.damage_relations.double_damage_from.map((source) => (
                  <span key={source.name} className={`type-badge type-${source.name}`}>
                    {source.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="effectiveness-section">
              <h4>Resiste a:</h4>
              <div className="type-list">
                {type.damage_relations.half_damage_from.map((source) => (
                  <span key={source.name} className={`type-badge type-${source.name}`}>
                    {source.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="effectiveness-section">
              <h4>Inmune a:</h4>
              <div className="type-list">
                {type.damage_relations.no_damage_from.map((source) => (
                  <span key={source.name} className={`type-badge type-${source.name}`}>
                    {source.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render del contenido de bayas
  const renderBerriesContent = () => (
    <div className="berries-section">
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={berrySearch}
            onChange={(e) => setBerrySearch(e.target.value)}
            placeholder="Buscar baya (nombre o ID)"
            className="form-control"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Buscar
          </button>
        </div>
      </div>

      {berry && (
        <div className="berry-details">
          <h3>{berry.name.charAt(0).toUpperCase() + berry.name.slice(1)} Berry</h3>
          
          <div className="berry-info-grid">
            <div className="berry-basic-info">
              <h4>Información Básica</h4>
              <p><strong>Tamaño:</strong> {berry.size} mm</p>
              <p><strong>Firmeza:</strong> {berry.firmness.name}</p>
              <p><strong>Tiempo de crecimiento:</strong> {berry.growth_time} horas</p>
              <p><strong>Cosecha máxima:</strong> {berry.max_harvest}</p>
              <p><strong>Suavidad:</strong> {berry.smoothness}</p>
              <p><strong>Poder de regalo natural:</strong> {berry.natural_gift_power}</p>
            </div>

            <div className="berry-flavors">
              <h4>Sabores</h4>
              {berry.flavors.map((flavor) => (
                <div key={flavor.flavor.name} className="flavor-item">
                  <span className="flavor-name">{flavor.flavor.name}:</span>
                  <span className="flavor-potency">{flavor.potency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pokemon-api-container">
      <h2>PokéAPI - Explorador de Pokémon</h2>
      <p className="api-description">
        Explora el mundo Pokémon usando la PokéAPI v2. Busca Pokémon, movimientos, tipos y bayas.
      </p>

      {/* Navegación por pestañas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('pokemon')}
          className={`tab-button ${activeTab === 'pokemon' ? 'active' : ''}`}
        >
          Pokémon
        </button>
        <button
          onClick={() => setActiveTab('moves')}
          className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
        >
          Movimientos
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`tab-button ${activeTab === 'types' ? 'active' : ''}`}
        >
          Tipos
        </button>
        <button
          onClick={() => setActiveTab('berries')}
          className={`tab-button ${activeTab === 'berries' ? 'active' : ''}`}
        >
          Bayas
        </button>
      </div>

      {/* Estados de carga y error */}
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {activeTab === 'pokemon' && renderPokemonContent()}
        {activeTab === 'moves' && renderMovesContent()}
        {activeTab === 'types' && renderTypesContent()}
        {activeTab === 'berries' && renderBerriesContent()}
      </div>

      {/* Información de la API */}
      <div className="api-info">
        <h4>Acerca de PokéAPI</h4>
        <p>
          PokéAPI es una API RESTful que proporciona información completa sobre el universo Pokémon.
          Es gratuita, no requiere autenticación y está disponible para uso educativo y comercial.
        </p>
        <p>
          <strong>URL Base:</strong> <code>https://pokeapi.co/api/v2/</code>
        </p>
        <p>
          <strong>Endpoints principales:</strong> pokemon, move, type, ability, berry, location, item, y más.
        </p>
      </div>
    </div>
  );
};
