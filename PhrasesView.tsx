import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, ActivityIndicator, ViewStyle } from 'react-native';
import { PhraseItem, sharedStyles } from './types';

interface PhrasesViewProps {
  loading: boolean;
  searchQuery: string;
  filteredPhrases: PhraseItem[];
  onSearch: (text: string) => void;
}

export default function PhrasesView({ loading, searchQuery, filteredPhrases, onSearch }: PhrasesViewProps) {
  const renderPhraseCard = ({ item }: { item: PhraseItem }) => {
    let badgeColorStyle: ViewStyle = styles.intermediate;
    if (item.difficulty.toLowerCase() === 'beginner') badgeColorStyle = styles.beginner;
    if (item.difficulty.toLowerCase() === 'advanced') badgeColorStyle = styles.advanced;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.wordText}>{item.phrase}</Text>
          <View style={[styles.badge, badgeColorStyle]}>
            <Text style={styles.badgeText}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.definitionText}>{item.meaning}</Text>
        <Text style={styles.exampleText}>Context: {item.context_use}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput 
        style={styles.searchBar} 
        placeholder="🔍 Search idioms, expressions, or meanings..." 
        value={searchQuery}
        onChangeText={onSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPhrases}
          keyExtractor={(item) => item.id}
          renderItem={renderPhraseCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No phrases match your search.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create(sharedStyles);
