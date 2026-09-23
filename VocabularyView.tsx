import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  ViewStyle 
} from 'react-native';
import { VocabularyItem, sharedStyles } from './types';

interface VocabularyViewProps {
  loading: boolean;
  searchQuery: string;
  filteredVocab: VocabularyItem[];
  onSearch: (text: string) => void;
}

export default function VocabularyView({ loading, searchQuery, filteredVocab, onSearch }: VocabularyViewProps) {
  
  const renderWordCard = ({ item }: { item: VocabularyItem }) => {
    let badgeColorStyle: ViewStyle = styles.intermediate;
    const lowerDiff = item.difficulty.toLowerCase();
    
    if (lowerDiff === 'beginner') badgeColorStyle = styles.beginner;
    if (lowerDiff === 'advanced') badgeColorStyle = styles.advanced;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.wordText}>{item.word}</Text>
          <View style={[styles.badge, badgeColorStyle]}>
            <Text style={styles.badgeText}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.definitionText}>{item.definition}</Text>
        <Text style={styles.exampleText}>"{item.example_sentence}"</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput 
        style={styles.searchBar} 
        placeholder="🔍 Search words or dictionary meanings..." 
        value={searchQuery}
        onChangeText={onSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredVocab}
          keyExtractor={(item) => item.id}
          renderItem={renderWordCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No vocabulary terms match.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create(sharedStyles);
