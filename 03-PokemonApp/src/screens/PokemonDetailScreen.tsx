import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { usePokemonDetail } from '../hooks/usePokemon';
import { PokemonCard } from '../types/pokemon';

interface PokemonDetailScreenProps {
  pokemon: PokemonCard;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({
  pokemon,
  onBack,
}) => {
  const { pokemon: pokemonDetail, loading, error, retry } = usePokemonDetail(pokemon.id);

  const getTypeColor = (type: string): string => {
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

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatPokemonId = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const getStatColor = (statValue: number): string => {
    if (statValue >= 100) return '#10b981';
    if (statValue >= 80) return '#f59e0b';
    if (statValue >= 60) return '#ef4444';
    return '#6b7280';
  };

  const getFlavorText = (): string => {
    if (!pokemonDetail?.species_data?.flavor_text_entries) return '';
    
    // Buscar texto en español primero, luego inglés
    const spanishEntry = pokemonDetail.species_data.flavor_text_entries.find(
      entry => entry.language.name === 'es'
    );
    const englishEntry = pokemonDetail.species_data.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    const entry = spanishEntry || englishEntry;
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : '';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pokemonDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Error al cargar'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const primaryType = pokemonDetail.types[0]?.type.name || 'normal';
  const backgroundColor = getTypeColor(primaryType);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{capitalizeFirst(pokemonDetail.name)}</Text>
        <Text style={styles.headerId}>{formatPokemonId(pokemonDetail.id)}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pokemon Image */}
        <View style={styles.imageSection}>
          {pokemonDetail.sprites.front_default ? (
            <Image
              source={{ uri: pokemonDetail.sprites.front_default }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Types */}
          <View style={styles.typesContainer}>
            {pokemonDetail.types.map((type, index) => (
              <View
                key={index}
                style={[
                  styles.typeChip,
                  { backgroundColor: getTypeColor(type.type.name) },
                ]}
              >
                <Text style={styles.typeText}>
                  {capitalizeFirst(type.type.name)}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {getFlavorText() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{getFlavorText()}</Text>
            </View>
          )}

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Altura</Text>
                <Text style={styles.infoValue}>
                  {(pokemonDetail.height / 10).toFixed(1)} m
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Peso</Text>
                <Text style={styles.infoValue}>
                  {(pokemonDetail.weight / 10).toFixed(1)} kg
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Experiencia Base</Text>
                <Text style={styles.infoValue}>{pokemonDetail.base_experience}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Orden</Text>
                <Text style={styles.infoValue}>{pokemonDetail.order}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            {pokemonDetail.stats.map((stat, index) => {
              const statName = stat.stat.name.replace('-', ' ');
              const statValue = stat.base_stat;
              const maxStat = 255; // Valor máximo teórico
              const percentage = (statValue / maxStat) * 100;

              return (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>
                    {capitalizeFirst(statName)}
                  </Text>
                  <Text style={styles.statValue}>{statValue}</Text>
                  <View style={styles.statBarContainer}>
                    <View
                      style={[
                        styles.statBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getStatColor(statValue),
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Abilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            {pokemonDetail.abilities.map((ability, index) => (
              <View key={index} style={styles.abilityItem}>
                <Text style={styles.abilityName}>
                  {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                </Text>
                {ability.is_hidden && (
                  <Text style={styles.hiddenAbility}>(Oculta)</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerId: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    minHeight: 500,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: (width - 72) / 2,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    width: 40,
    textAlign: 'right',
    marginRight: 12,
  },
  statBarContainer: {
    flex: 2,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  abilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  abilityName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  hiddenAbility: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
    fontStyle: 'italic',
  },
});
