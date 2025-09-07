// Utilidades para formateo de texto y datos de Pokémon

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const formatHeight = (heightInDecimeters: number): string => {
  return `${(heightInDecimeters / 10).toFixed(1)} m`;
};

export const formatWeight = (weightInHectograms: number): string => {
  return `${(weightInHectograms / 10).toFixed(1)} kg`;
};

export const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#68A090';
};

export const getStatColor = (statValue: number): string => {
  if (statValue >= 100) return '#10b981';
  if (statValue >= 80) return '#f59e0b';
  if (statValue >= 60) return '#ef4444';
  return '#6b7280';
};

export const formatStatName = (statName: string): string => {
  const statNames: { [key: string]: string } = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    'speed': 'Velocidad',
  };
  return statNames[statName] || capitalizeFirst(statName.replace('-', ' '));
};

export const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
};

export const getGenerationFromId = (id: number): string => {
  if (id <= 151) return 'I';
  if (id <= 251) return 'II';
  if (id <= 386) return 'III';
  if (id <= 493) return 'IV';
  if (id <= 649) return 'V';
  if (id <= 721) return 'VI';
  if (id <= 809) return 'VII';
  if (id <= 905) return 'VIII';
  return 'IX';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
