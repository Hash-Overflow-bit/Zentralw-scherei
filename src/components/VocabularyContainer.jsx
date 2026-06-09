import { useState, useEffect, useRef } from 'react';
import { languages, vocabularyCategories, vocabularyWords, basicVocabularyWords } from '../data/laundryVocabulary';

export default function VocabularyContainer({ vocabType, onBack }) {
  const isCompany = vocabType === 'company';
  
  // States
  const [words, setWords] = useState(() => {
    return isCompany ? [...basicVocabularyWords] : [...vocabularyWords];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('en');
  const [sortBy, setSortBy] = useState('word-asc'); // Default alphabetical sorting is cleaner for rows
  const [quizMode, setQuizMode] = useState(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);

  // Pre-warm SpeechSynthesis voices list
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speakGerman = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech synthesis immediately
      window.speechSynthesis.cancel();

      // Clean up slash and dashes for natural pronunciation
      let cleanText = text
        .replace(/\s*\/\s*/g, ' oder ') // "an / zu" -> "an oder zu"
        .replace(/-/g, '');             // "dies-" -> "dies"

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';

      // Pick the best German voice
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Google')) ||
                          voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Natural')) ||
                          voices.find(voice => voice.lang === 'de-DE') ||
                          voices.find(voice => voice.lang.startsWith('de'));

      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      utterance.rate = 0.85; // Slightly slower for learner clarity
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Set default language directions
  const currentLangObj = languages.find(l => l.code === nativeLanguage) || languages[0];
  const isRTL = currentLangObj.rtl;

  // Filter & Sort Logic
  const filteredWords = words
    .filter(item => {
      // Search Query (German word)
      return item.word.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'id-asc') {
        return parseInt(a.id) - parseInt(b.id);
      }
      if (sortBy === 'id-desc') {
        return parseInt(b.id) - parseInt(a.id);
      }
      if (sortBy === 'word-asc') {
        // Remove article prefix if sorting alphabetically
        const cleanA = a.word.replace(/^(der|die|das)\s+/i, '');
        const cleanB = b.word.replace(/^(der|die|das)\s+/i, '');
        return cleanA.localeCompare(cleanB, 'de');
      }
      if (sortBy === 'word-desc') {
        const cleanA = a.word.replace(/^(der|die|das)\s+/i, '');
        const cleanB = b.word.replace(/^(der|die|das)\s+/i, '');
        return cleanB.localeCompare(cleanA, 'de');
      }
      return 0;
    });

  // Quiz Init
  const startQuiz = () => {
    // We only quiz words that have a valid translation in selected native language
    const quizPool = words.filter(w => w.translations[nativeLanguage] && w.translations[nativeLanguage].trim() !== '');
    if (quizPool.length < 2) {
      alert(`Bitte stelle sicher, dass mindestens 2 Wörter Übersetzungen ins ${currentLangObj.nativeName} (${currentLangObj.name}) haben, bevor du das Quiz startest.`);
      return;
    }

    // Shuffle and pick up to 10 questions
    const shuffled = [...quizPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    // Generate options for each question (Native word -> German translation choice)
    const questions = selected.map(word => {
      const nativePrompt = word.translations[nativeLanguage];
      const correctAnswer = word.word;
      
      // Get wrong answers (distractors) from other words' German terms
      const otherGermanWords = words
        .filter(w => w.id !== word.id && w.word)
        .map(w => w.word);

      // Unique distractors
      const uniqueDistractors = Array.from(new Set(otherGermanWords)).filter(w => w !== correctAnswer);
      const shuffledDistractors = uniqueDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);

      // Combine and shuffle choices
      const choices = [correctAnswer, ...shuffledDistractors].sort(() => 0.5 - Math.random());

      return {
        nativePrompt,
        correctAnswer,
        choices
      };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswers(new Array(questions.length).fill(null));
    setQuizMode(true);
  };

  const handleAnswerClick = (choice) => {
    if (quizAnswers[quizIndex] !== null) return; // Already answered
    
    const newAnswers = [...quizAnswers];
    newAnswers[quizIndex] = choice;
    setQuizAnswers(newAnswers);
    
    const correct = choice === quizQuestions[quizIndex].correctAnswer;
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Show results card inside quiz
      setQuizIndex(quizQuestions.length);
    }
  };

  return (
    <div className="vocab-detail-container">
      {/* 1. Minimalistic & Elegant Control Row */}
      <header className="vocab-control-row">
        <div className="vocab-control-left">
          <button className="back-btn" onClick={onBack} title="Zurück zur Startseite" style={{ borderRadius: '8px', padding: '0 12px', width: 'auto', height: '40px', fontWeight: 700, fontSize: '14px' }}>
            Zurück
          </button>
          <div className="vocab-title-wrapper">
            <h2 className="vocab-title">{isCompany ? 'Vokabular ZWC' : 'Vokabular Deutsch'}</h2>
          </div>
        </div>

        <div className="vocab-control-right">
          {/* Native Language Dropdown */}
          <div className="dropdown-native-lang">
            <div className="select-container">
              <select 
                id="native-lang-select" 
                value={nativeLanguage} 
                onChange={(e) => {
                  setNativeLanguage(e.target.value);
                }}
                className="native-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* German Search Bar */}
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              placeholder="Suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          {/* Direct Quiz Button */}
          <button 
            className="tool-menu-btn"
            onClick={startQuiz}
            title="Quiz starten"
          >
            <span>Quiz</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Grid/Quiz Mode */}
      {quizMode ? (
        /* QUIZ MODE COMPONENT */
        <div className="quiz-container-overlay">
          <div className="quiz-card">
            {quizIndex < quizQuestions.length ? (
              <>
                <div className="quiz-header">
                  <span className="quiz-progress">Frage {quizIndex + 1} von {quizQuestions.length}</span>
                  <button className="quiz-close-btn" onClick={() => setQuizMode(false)}>Quiz beenden</button>
                </div>

                <div className="quiz-question-box">
                  <h3 className="quiz-word-german" dir={isRTL ? 'rtl' : 'ltr'}>
                    {quizQuestions[quizIndex].nativePrompt}
                  </h3>
                  <p className="quiz-prompt-text">Deutsch:</p>
                </div>

                <div className="quiz-choices-grid">
                  {quizQuestions[quizIndex].choices.map((choice) => {
                    const answer = quizAnswers[quizIndex];
                    const isAnswered = answer !== null;
                    let btnClass = 'quiz-choice-btn';
                    
                    if (isAnswered) {
                      if (choice === quizQuestions[quizIndex].correctAnswer) {
                        btnClass += ' correct';
                      } else if (choice === answer) {
                        btnClass += ' incorrect';
                      } else {
                        btnClass += ' disabled';
                      }
                    }
                    
                    return (
                      <button 
                        key={choice} 
                        className={btnClass}
                        onClick={() => handleAnswerClick(choice)}
                        disabled={isAnswered}
                        dir="ltr"
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {quizAnswers[quizIndex] !== null && (
                  <div className="quiz-feedback-container">
                    <p className={`quiz-feedback-text ${quizAnswers[quizIndex] === quizQuestions[quizIndex].correctAnswer ? 'success' : 'error'}`}>
                      {quizAnswers[quizIndex] === quizQuestions[quizIndex].correctAnswer ? 'Richtig!' : 'Falsch. Lern weiter!'}
                    </p>
                    <button className="quiz-next-btn" onClick={handleNextQuestion}>
                      {quizIndex + 1 === quizQuestions.length ? 'Ergebnisse anzeigen' : 'Nächste Frage →'}
                    </button>
                  </div>
                )}

                {/* Navigation / Action Buttons Row */}
                <div className="quiz-nav-row">
                  <button 
                    className="quiz-nav-btn back" 
                    onClick={() => setQuizIndex(prev => Math.max(0, prev - 1))}
                    disabled={quizIndex === 0}
                  >
                    ← Zurück
                  </button>
                  <button 
                    className="quiz-nav-btn restart" 
                    onClick={startQuiz}
                  >
                    Neustarten
                  </button>
                </div>
              </>
            ) : (
              /* MINIMALISTIC RESULTS SCREEN */
              <div className="quiz-summary-box minimalistic">
                <h2 className="summary-title">Quiz beendet</h2>
                
                <div className="summary-score-minimal">
                  <span className="score-main">{quizScore}</span>
                  <span className="score-divider">/</span>
                  <span className="score-total-min">{quizQuestions.length}</span>
                </div>
                
                <p className="summary-text">
                  Richtig beantwortete Fragen
                </p>
                
                <div className="quiz-summary-actions">
                  <button className="quiz-btn-primary" onClick={startQuiz} style={{ flex: 1 }}>Quiz neustarten</button>
                  <button className="quiz-btn-secondary" onClick={() => setQuizMode(false)} style={{ flex: 1 }}>Schliessen</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MINIMALISTIC LIST OF ROWS */
        <main className="vocab-grid-main">
          {filteredWords.length === 0 ? (
            <div className="no-words-placeholder">
              <h3>Keine Begriffe gefunden</h3>
              <p>Passe die Suche oder Filter an.</p>
            </div>
          ) : (
            <div className="words-list">
              <div className="words-list-header">
                <div className="header-col-german">Deutsch</div>
                <div className="header-col-translation">
                  {currentLangObj.nativeName} ({currentLangObj.name})
                </div>
              </div>
              {filteredWords.map((item, index) => {
                const translation = item.translations[nativeLanguage];
                const hasTranslation = translation && translation.trim() !== '';

                return (
                  <div key={item.id} className="word-row">
                    {/* Left: German Word */}
                    <div 
                      className="word-row-german tts-clickable"
                      onClick={() => speakGerman(item.word)}
                      title="Aussprache anhören (de-DE)"
                    >
                      <span className="german-text" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '48px', display: 'inline-block', opacity: 0.6 }}>{index + 1})</span>
                        <span>{item.word}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tts-icon" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </div>

                    {/* Right: Native Translation */}
                    <div className="word-row-translation">
                      {hasTranslation ? (
                        <span 
                          className="translation-text" 
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          {translation}
                        </span>
                      ) : (
                        <span 
                          className="translation-text fallback" 
                          dir="ltr"
                          style={{ opacity: 0.6, fontStyle: 'italic' }}
                        >
                          {item.translations.en || ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
