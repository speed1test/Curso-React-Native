import { useState, useEffect, useCallback, useRef } from 'react';
import pokemonAPI from '../services/pokemonAPI';
import { PokemonCard, PokemonDetail, PokemonListResponse } from '../types/pokemon';
import { debounce } from '../utils/formatters';

export interface UsePokemonListResult {
  pokemon: PokemonCard[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function usePokemonList(initialLimit: number = 20): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPokemon = useCallback(async (currentOffset: number, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }
      setError(null);

      const response: PokemonListResponse = await pokemonAPI.getPokemonList(initialLimit, currentOffset);
      
      // Obtener detalles de cada Pokémon para las tarjetas
      const pokemonDetails = await Promise.all(
        response.results.map(async (p) => {
          const pokemon = await pokemonAPI.getPokemon(p.name);
          return pokemonAPI.pokemonToCard(pokemon);
        })
      );

      if (append) {
        setPokemon(prev => [...prev, ...pokemonDetails]);
      } else {
        setPokemon(pokemonDetails);
      }

      setHasMore(response.next !== null);
      setOffset(currentOffset + initialLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading Pokemon');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialLimit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPokemon(offset, true);
    }
  }, [loading, hasMore, offset, loadPokemon]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    loadPokemon(0, false);
  }, [loadPokemon]);

  useEffect(() => {
    loadPokemon(0);
  }, [loadPokemon]);

  return {
    pokemon,
    loading: loading || refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

export interface UsePokemonDetailResult {
  pokemon: PokemonDetail | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function usePokemonDetail(idOrName: string | number): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const pokemonDetail = await pokemonAPI.getPokemonDetails(idOrName);
      setPokemon(pokemonDetail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading Pokemon details');
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }, [idOrName]);

  const retry = useCallback(() => {
    loadPokemon();
  }, [loadPokemon]);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  return {
    pokemon,
    loading,
    error,
    retry,
  };
}

export interface UseSearchPokemonResult {
  results: PokemonCard[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
}

export function useSearchPokemon(): UseSearchPokemonResult {
  const [results, setResults] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController para esta búsqueda
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await pokemonAPI.searchPokemon(query.trim());
      
      // Solo actualizar si la búsqueda no fue cancelada
      if (!abortControllerRef.current.signal.aborted) {
        setResults(searchResults);
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'Error searching Pokemon';
        setError(errorMessage);
        setResults([]);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Debounce la búsqueda para no hacer demasiadas peticiones
  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 500),
    [performSearch]
  );

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clear = useCallback(() => {
    // Cancelar búsqueda en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}
