import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import { VocabularyItem, QuizQuestion, PhraseItem, ActiveTab, sharedStyles } from './types';
import VocabularyView from './VocabularyView';
import PhrasesView from './PhrasesView';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vocab');

  // Vocabulary Tab State
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filteredVocab, setFilteredVocab] = useState<VocabularyItem[]>([]);
  const [loadingVocab, setLoadingVocab] = useState<boolean>(true);
  const [vocabSearch, setVocabSearch] = useState<string>('');

  // Phrases Tab State
  const [phrases, setPhrases] = useState<PhraseItem[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<PhraseItem[]>([]);
  const [loadingPhrases, setLoadingPhrases] = useState<boolean>(true);
  const [phraseSearch, setPhraseSearch] = useState<string>('');

  // Quiz Engine State
  const [quizPool, setQuizPool] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const { data: vData, error: vError } = await supabase.from('vocabulary').select('*').order('word', { ascending: true });
        if (vError) throw vError;
        const typedVocab = (vData as VocabularyItem[]) || [];
        setVocabulary(typedVocab);
        setFilteredVocab(typedVocab);
        setLoadingVocab(false);

        const { data: pData, error: pError } = await supabase.from('phrases').select('*').order('phrase', { ascending: true });
        if (pError) throw pError;
        const typedPhrases = (pData as PhraseItem[]) || [];
        setPhrases(typedPhrases);
        setFilteredPhrases(typedPhrases);
        setLoadingPhrases(false);
      } catch (err: any) {
        console.error('Database connection exception:', err.message);
        setLoadingVocab(false);
        setLoadingPhrases(false);
      }
    }
    fetchAllData();
  }, []);

  const startNewQuiz = async () => {
    setLoadingQuiz(true);
    setQuizComplete(false);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);

    try {
      const { data, error } = await supabase.from('quiz_questions').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const typedQuestions = data as QuizQuestion[];
        const shuffledPool = [...typedQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuizPool(shuffledPool);
        prepareQuestionOptions(shuffledPool[0]);
      }
    } catch (err: any) {
      console.error('Quiz initialization error:', err.message);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const prepareQuestionOptions = (questionObj: QuizQuestion) => {
    if (!questionObj) return;
    const options = [
      questionObj.correct_option,
      questionObj.wrong_option_1,
      questionObj.wrong_option_2,
      questionObj.wrong_option_3
    ].sort(() => 0.5 - Math.random());
    setShuffledOptions(options);
    setSelectedAnswer(null);
  };

  const handleOptionPress = (optionText: string, activeQuestion: QuizQuestion) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionText);
    if (optionText === activeQuestion.correct_option) setScore(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < quizPool.length) {
      setCurrentIdx(nextIdx);
      prepareQuestionOptions(quizPool[nextIdx]);
    } else {
      setQuizComplete(true);
    }
  };

  const handleVocabSearch = (text: string) => {
    setVocabSearch(text);
    if (!text.trim()) { setFilteredVocab(vocabulary); return; }
    const filtered = vocabulary.filter(item => 
      item.word.toLowerCase().includes(text.toLowerCase()) ||
      item.definition.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVocab(filtered);
  };

  const handlePhraseSearch = (text: string) => {
    setPhraseSearch(text);
    if (!text.trim()) { setFilteredPhrases(phrases); return; }
    const filtered = phrases.filter(item => 
      item.phrase.toLowerCase().includes(text.toLowerCase()) ||
      item.meaning.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPhrases(filtered);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={[styles.navButton, activeTab === 'vocab' && styles.activeNavButton]} onPress={() => setActiveTab('vocab')}>
            <Text style={[styles.navButtonText, activeTab === 'vocab' && styles.activeNavButtonText]}>📚 Vocab</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, activeTab === 'phrases' && styles.activeNavButton]} onPress={() => setActiveTab('phrases')}>
            <Text style={[styles.navButtonText, activeTab === 'phrases' && styles.activeNavButtonText]}>💬 Phrases</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, activeTab === 'quiz' && styles.activeNavButton]} onPress={() => { setActiveTab('quiz'); if (quizPool.length === 0 || quizComplete) startNewQuiz(); }}>
            <Text style={[styles.navButtonText, activeTab === 'quiz' && styles.activeNavButtonText]}>📝 Quiz</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'vocab' && (
          <VocabularyView loading={loadingVocab} searchQuery={vocabSearch} filteredVocab={filteredVocab} onSearch={handleVocabSearch} />
        )}

        {activeTab === 'phrases' && (
          <PhrasesView loading={loadingPhrases} searchQuery={phraseSearch} filteredPhrases={filteredPhrases} onSearch={handlePhraseSearch} />
        )}

        {activeTab === 'quiz' && (
          <ScrollView contentContainerStyle={styles.quizContainer}>
            {loadingQuiz ? (
              <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
            ) : quizComplete ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultEmoji}>🏆</Text>
                <Text style={styles.resultTitle}>Quiz Completed!</Text>
                <Text style={styles.resultScore}>Your Score: {score} / {quizPool.length}</Text>
                <TouchableOpacity style={styles.restartBtn} onPress={startNewQuiz}>
                  <Text style={styles.restartBtnText}>Take Another Quiz</Text>
                </TouchableOpacity>
              </View>
            ) : quizPool.length > 0 ? (
              <View style={{ width: '100%' }}>
                <Text style={styles.progressText}>Question {currentIdx + 1} of {quizPool.length}</Text>
                <View style={styles.questionCard}>
                  <Text style={styles.questionText}>{quizPool[currentIdx].question_text}</Text>
                </View>

                {shuffledOptions.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === quizPool[currentIdx].correct_option;
                  let buttonStyle: any[] = [styles.optionBtn];
                  let textStyle: any[] = [styles.optionBtnText];

                  if (selectedAnswer !== null) {
                    if (isCorrect) { buttonStyle.push(styles.correctBtn); textStyle.push(styles.correctBtnText); }
                    else if (isSelected && !isCorrect) { buttonStyle.push(styles.wrongBtn); textStyle.push(styles.wrongBtnText); }
                  }

                  return (
                    <TouchableOpacity key={index} style={buttonStyle} onPress={() => handleOptionPress(option, quizPool[currentIdx])} activeOpacity={0.7}>
                      <Text style={textStyle}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedAnswer !== null && (
                  <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
                    <Text style={styles.nextBtnText}>{currentIdx + 1 === quizPool.length ? 'Finish Quiz 🎉' : 'Next Question ➡️'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.emptyText}>No questions configured inside cloud tables.</Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create(sharedStyles);
