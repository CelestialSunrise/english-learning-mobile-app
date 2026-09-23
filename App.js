import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using Expo's native public environment variable prefix
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocab, setFilteredVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live vocabulary data from Supabase cloud database
  useEffect(() => {
    async function fetchWords() {
      try {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .order('word', { ascending: true });

        if (error) throw error;
        setVocabulary(data || []);
        setFilteredVocab(data || []);
      } catch (err) {
        console.error('Database connection error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWords();
  }, []);

  // Handle local typing search filter
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredVocab(vocabulary);
      return;
    }
    const filtered = vocabulary.filter(item => 
      item.word.toLowerCase().includes(text.toLowerCase()) ||
      item.definition.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVocab(filtered);
  };

  // Render function for the mobile scroll card items
  const renderWordCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={[styles.badge, styles[item.difficulty.toLowerCase()]]}>
          <Text style={styles.badgeText}>{item.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.definitionText}>{item.definition}</Text>
      <Text style={styles.exampleText}>"{item.example_sentence}"</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>📚 English Vocabulary</Text>
        
        <TextInput 
          style={styles.searchBar} 
          placeholder="🔍 Search vocabulary words..." 
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Downloading datasets from cloud...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredVocab}
            keyExtractor={(item) => item.id}
            renderItem={renderWordCard}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No vocabulary terms match your search.</Text>
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Mobile StyleSheet - Scaled directly for handheld screens
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', padding: 16, color: '#333', textAlign: 'center' },
  searchBar: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginHorizontal: 16, paddingHorizontal: 12, backgroundColor: '#fff', fontSize: 16, marginBottom: 10 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  centerContainer: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderHWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  wordText: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  beginner: { backgroundColor: '#28a745' },
  intermediate: { backgroundColor: '#ffc107' },
  advanced: { backgroundColor: '#dc3545' },
  definitionText: { fontSize: 16, color: '#444', marginBottom: 6, lineHeight: 22 },
  exampleText: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }
});
