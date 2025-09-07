import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  PokemonCard,
  PokemonDetail,
} from '../types/pokemon';

class PokemonAPIService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private cache = new Map<string, any>();
  private readonly cacheExpiry = 5 * 60 * 1000; // 5 minutos

  private getCacheKey(url: string): string {
    return url.replace(this.baseUrl, '');
  }

  private isValidCache(cacheEntry: { data: any; timestamp: number }): boolean {
    return Date.now() - cacheEntry.timestamp < this.cacheExpiry;
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = this.getCacheKey(url);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached)) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: T = await response.json();
      
      // Guardar en cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching from API:', error);
      throw error;
    }
  }

  // Obtener lista paginada de Pokémon
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    return this.fetchWithCache<PokemonListResponse>(url);
  }

  // Obtener Pokémon por ID o nombre
  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${idOrName}`;
    return this.fetchWithCache<Pokemon>(url);
  }

  // Obtener especies de Pokémon por ID o nombre
  async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
    const url = `${this.baseUrl}/pokemon-species/${idOrName}`;
    return this.fetchWithCache<PokemonSpecies>(url);
  }

  // Obtener cadena de evolución por ID
  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    const url = `${this.baseUrl}/evolution-chain/${id}`;
    return this.fetchWithCache<EvolutionChain>(url);
  }

  // Obtener detalles completos de un Pokémon (incluyendo especies y evoluciones)
  async getPokemonDetails(idOrName: string | number): Promise<PokemonDetail> {
    try {
      const pokemon = await this.getPokemon(idOrName);
      
      // Obtener datos de especies
      const speciesData = await this.getPokemonSpecies(pokemon.id);
      
      // Obtener cadena de evolución
      let evolutionChainData: EvolutionChain | undefined;
      if (speciesData.evolution_chain?.url) {
        const chainId = this.extractIdFromUrl(speciesData.evolution_chain.url);
        evolutionChainData = await this.getEvolutionChain(chainId);
      }

      return {
        ...pokemon,
        species_data: speciesData,
        evolution_chain_data: evolutionChainData,
      };
    } catch (error) {
      console.error('Error getting pokemon details:', error);
      throw error;
    }
  }

  // Convertir datos de Pokémon a formato de tarjeta para la UI
  pokemonToCard(pokemon: Pokemon): PokemonCard {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default || '',
      types: pokemon.types.map(t => t.type.name),
    };
  }

  // Buscar Pokémon por nombre (con autocompletado)
  async searchPokemon(query: string): Promise<PokemonCard[]> {
    try {
      const searchQuery = query.toLowerCase().trim();
      
      if (!searchQuery) {
        return [];
      }

      // Primero intentar búsqueda exacta por nombre o ID
      if (/^\d+$/.test(searchQuery)) {
        // Si es un número, buscar por ID
        const pokemon = await this.getPokemon(parseInt(searchQuery));
        return [this.pokemonToCard(pokemon)];
      } else {
        // Buscar por nombre exacto
        try {
          const pokemon = await this.getPokemon(searchQuery);
          return [this.pokemonToCard(pokemon)];
        } catch (error) {
          // Si no encuentra por nombre exacto, hacer búsqueda por similitud
          return this.searchByPartialName(searchQuery);
        }
      }
    } catch (error) {
      console.error('Error searching pokemon:', error);
      return [];
    }
  }

  // Búsqueda por coincidencia parcial
  private async searchByPartialName(query: string): Promise<PokemonCard[]> {
    try {
      // Obtener lista de Pokémon para buscar coincidencias
      const pokemonList = await this.getPokemonList(1000, 0); // Obtener los primeros 1000
      
      // Filtrar por nombres que contengan la query
      const matches = pokemonList.results.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query)
      );
      
      // Limitar a 10 resultados para no sobrecargar
      const limitedMatches = matches.slice(0, 10);
      
      // Obtener detalles de cada coincidencia
      const searchResults = await Promise.all(
        limitedMatches.map(async (p) => {
          const pokemon = await this.getPokemon(p.name);
          return this.pokemonToCard(pokemon);
        })
      );

      return searchResults;
    } catch (error) {
      console.error('Error in partial name search:', error);
      return [];
    }
  }

  // Obtener Pokémon por tipo
  async getPokemonByType(type: string): Promise<PokemonCard[]> {
    try {
      const typeUrl = `${this.baseUrl}/type/${type}`;
      const typeData = await this.fetchWithCache<any>(typeUrl);
      
      // Limitar a los primeros 20 para no sobrecargar
      const pokemonPromises = typeData.pokemon
        .slice(0, 20)
        .map(async (p: any) => {
          const pokemon = await this.getPokemon(p.pokemon.name);
          return this.pokemonToCard(pokemon);
        });

      return Promise.all(pokemonPromises);
    } catch (error) {
      console.error('Error getting pokemon by type:', error);
      return [];
    }
  }

  // Utilidad para extraer ID de una URL de la API
  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }

  // Limpiar cache (útil para liberar memoria)
  clearCache(): void {
    this.cache.clear();
  }

  // Obtener estadísticas del cache
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Exportar instancia singleton
export const pokemonAPI = new PokemonAPIService();
export default pokemonAPI;
