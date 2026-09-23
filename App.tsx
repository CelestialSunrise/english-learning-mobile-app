import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import { VocabularyItem, QuizQuestion, ActiveTab, sharedStyles } from './types';
import VocabularyView from './VocabularyView';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vocab');

  // Vocabulary State Hooks
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filteredVocab, setFilteredVocab] = useState<VocabularyItem[]>([]);
  const [loadingVocab, setLoadingVocab] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quiz State Hooks
  const [quizPool, setQuizPool] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWords() {
      try {
        const { data, error } = await supabase.from('vocabulary').select('*').order('word', { ascending: true });
        if (error) throw error;
        const typedData = (data as VocabularyItem[]) || [];
        setVocabulary(typedData);
        setFilteredVocab(typedData);
      } catch (err: any) {
        console.error('Database connection error:', err.message);
      } finally {
        setLoadingVocab(false);
      }
    }
    fetchWords();
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
      console.error('Quiz data fetching error:', err.message);
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

  const handleSearch = (text: string) => {
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={[styles.navButton, activeTab === 'vocab' && styles.activeNavButton]} onPress={() => setActiveTab('vocab')}>
            <Text style={[styles.navButtonText, activeTab === 'vocab' && styles.activeNavButtonText]}>📚 Directory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, activeTab === 'quiz' && styles.activeNavButton]} onPress={() => { setActiveTab('quiz'); if (quizPool.length === 0 || quizComplete) startNewQuiz(); }}>
            <Text style={[styles.navButtonText, activeTab === 'quiz' && styles.activeNavButtonText]}>📝 Vocabulary Quiz</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'vocab' ? (
          <VocabularyView loading={loadingVocab} searchQuery={searchQuery} filteredVocab={filteredVocab} onSearch={handleSearch} />
        ) : (
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
