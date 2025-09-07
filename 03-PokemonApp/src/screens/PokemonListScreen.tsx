import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { PokemonCardComponent } from '../components/PokemonCard';
import { usePokemonList, useSearchPokemon } from '../hooks/usePokemon';
import { PokemonCard } from '../types/pokemon';

interface PokemonListScreenProps {
  onPokemonPress: (pokemon: PokemonCard) => void;
}

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({
  onPokemonPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const {
    pokemon,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePokemonList(20);

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    clear: clearSearch,
  } = useSearchPokemon();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      search(query);
    } else {
      setIsSearching(false);
      clearSearch();
    }
  };

  const getSearchPlaceholder = () => {
    return "Buscar por nombre o número...";
  };

  const getSearchInstructions = () => {
    if (!searchQuery.trim()) return null;
    
    if (searchLoading) {
      return (
        <View style={styles.searchInstructions}>
          <Text style={styles.instructionsText}>Buscando "{searchQuery}"...</Text>
        </View>
      );
    }
    
    if (searchResults.length === 0 && !searchError) {
      return (
        <View style={styles.searchInstructions}>
          <Text style={styles.instructionsText}>
            No se encontraron Pokémon que coincidan con "{searchQuery}"
          </Text>
          <Text style={styles.instructionsSubtext}>
            Intenta buscar por nombre (ej: "pikachu") o número (ej: "25")
          </Text>
        </View>
      );
    }
    
    return null;
  };

  const handlePokemonPress = (pokemon: PokemonCard) => {
    onPokemonPress(pokemon);
  };

  const renderPokemonCard = ({ item }: { item: PokemonCard }) => (
    <PokemonCardComponent pokemon={item} onPress={handlePokemonPress} />
  );

  const renderFooter = () => {
    if (!loading || isSearching) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando más Pokémon...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading || searchLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>
            {isSearching ? 'Buscando...' : 'Cargando Pokémon...'}
          </Text>
        </View>
      );
    }

    if (error || searchError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error || searchError}
          </Text>
          <Text style={styles.retryText} onPress={refresh}>
            Toca para reintentar
          </Text>
        </View>
      );
    }

    if (isSearching && searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            No se encontró ningún Pokémon con "{searchQuery}"
          </Text>
        </View>
      );
    }

    return null;
  };

  const displayData = isSearching ? searchResults : pokemon;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>
          {isSearching 
            ? `${searchResults.length} resultado(s)` 
            : `${pokemon.length} Pokémon`
          }
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={getSearchPlaceholder()}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Search Instructions */}
      {getSearchInstructions()}

      {/* Pokemon List */}
      <FlatList
        data={displayData}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={!isSearching ? loadMore : undefined}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 16,
    color: '#3b82f6',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  searchInstructions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  instructionsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionsSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
