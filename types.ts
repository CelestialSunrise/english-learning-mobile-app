import { ViewStyle, TextStyle } from 'react-native';

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  example_sentence: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

export interface QuizQuestion {
  id: string;
  word_id: string;
  question_text: string;
  correct_option: string;
  wrong_option_1: string;
  wrong_option_2: string;
  wrong_option_3: string;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  meaning: string;
  context_use: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

export type ActiveTab = 'vocab' | 'quiz' | 'phrases';

export const sharedStyles = {
  container: { flex: 1, backgroundColor: '#f8f9fa' } as ViewStyle,
  navBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e1e4e8', backgroundColor: '#fff', marginBottom: 12 } as ViewStyle,
  navButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' } as ViewStyle,
  activeNavButton: { borderBottomColor: '#007bff' } as ViewStyle,
  navButtonText: { fontSize: 13, fontWeight: '600', color: '#6a737d' } as TextStyle,
  activeNavButtonText: { color: '#007bff' } as TextStyle,
  searchBar: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginHorizontal: 16, paddingHorizontal: 12, backgroundColor: '#fff', fontSize: 16, marginBottom: 12 } as ViewStyle,
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 } as ViewStyle,
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } as ViewStyle,
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } as ViewStyle,
  wordText: { fontSize: 20, fontWeight: 'bold', color: '#007bff' } as TextStyle,
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 } as ViewStyle,
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 } as TextStyle,
  beginner: { backgroundColor: '#28a745' } as ViewStyle,
  intermediate: { backgroundColor: '#ffc107' } as ViewStyle,
  advanced: { backgroundColor: '#dc3545' } as ViewStyle,
  definitionText: { fontSize: 16, color: '#444', marginBottom: 6, lineHeight: 22 } as TextStyle,
  exampleText: { fontSize: 14, color: '#666', fontStyle: 'italic' } as TextStyle,
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 } as TextStyle,
  quizContainer: { padding: 16, alignItems: 'center' } as ViewStyle,
  progressText: { fontSize: 14, color: '#6a737d', alignSelf: 'flex-start', marginBottom: 8, fontWeight: '600' } as TextStyle,
  questionCard: { backgroundColor: '#fff', width: '100%', padding: 24, borderRadius: 12, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#007bff', elevation: 2 } as ViewStyle,
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#24292e', lineHeight: 26 } as TextStyle,
  optionBtn: { backgroundColor: '#fff', width: '100%', padding: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#d1d5da', justifyContent: 'center' } as ViewStyle,
  optionBtnText: { fontSize: 16, color: '#24292e' } as TextStyle,
  correctBtn: { backgroundColor: '#d4edda', borderColor: '#c3e6cb' } as ViewStyle,
  correctBtnText: { color: '#155724', fontWeight: 'bold' } as TextStyle,
  wrongBtn: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' } as ViewStyle,
  wrongBtnText: { color: '#721c24', fontWeight: 'bold' } as TextStyle,
  nextBtn: { backgroundColor: '#24292e', width: '100%', padding: 16, borderRadius: 8, marginTop: 15, alignItems: 'center' } as ViewStyle,
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' } as TextStyle,
  resultCard: { backgroundColor: '#fff', padding: 32, borderRadius: 12, alignItems: 'center', width: '100%', marginTop: 20, elevation: 3 } as ViewStyle,
  resultEmoji: { fontSize: 64, marginBottom: 16 } as TextStyle,
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#24292e', marginBottom: 8 } as TextStyle,
  resultScore: { fontSize: 20, color: '#28a745', fontWeight: '700', marginBottom: 24 } as TextStyle,
  restartBtn: { backgroundColor: '#007bff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6 } as ViewStyle,
  restartBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' } as TextStyle
};
