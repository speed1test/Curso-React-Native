import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PokemonCard } from '../types/pokemon';
import { capitalizeFirst, formatPokemonId, getTypeColor } from '../utils/formatters';

interface PokemonCardComponentProps {
  pokemon: PokemonCard;
  onPress: (pokemon: PokemonCard) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columnas con padding

export const PokemonCardComponent: React.FC<PokemonCardComponentProps> = ({
  pokemon,
  onPress,
}) => {

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: getTypeColor(pokemon.types[0]) + '20' },
      ]}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {pokemon.image ? (
          <Image
            source={{ uri: pokemon.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.id}>{formatPokemonId(pokemon.id)}</Text>
        <Text style={styles.name}>{capitalizeFirst(pokemon.name)}</Text>
        
        <View style={styles.typesContainer}>
          {pokemon.types.map((type, index) => (
            <View
              key={index}
              style={[
                styles.typeChip,
                { backgroundColor: getTypeColor(type) },
              ]}
            >
              <Text style={styles.typeText}>{capitalizeFirst(type)}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    margin: 8,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
  },
  id: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
