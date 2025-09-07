/**
 * PokemonApp - React Native App with PokéAPI v2
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { PokemonListScreen, PokemonDetailScreen } from './src';
import type { PokemonCard } from './src';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonCard | null>(null);

  const handlePokemonPress = (pokemon: PokemonCard) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackPress = () => {
    setSelectedPokemon(null);
  };

  return (
    <SafeAreaProvider>
      {selectedPokemon ? (
        <PokemonDetailScreen
          pokemon={selectedPokemon}
          onBack={handleBackPress}
        />
      ) : (
        <PokemonListScreen onPokemonPress={handlePokemonPress} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
