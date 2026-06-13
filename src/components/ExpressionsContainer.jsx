import { useEffect } from 'react';
import { expressionsData } from '../data/expressionsData';

export default function ExpressionsContainer({ onBack }) {

  // Pre-warm SpeechSynthesis voices list
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speakGerman = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      let cleanText = text
        .replace(/\s*\/\s*/g, ' oder ')
        .replace(/-/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';

      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Google')) ||
                          voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Natural')) ||
                          voices.find(voice => voice.lang === 'de-DE') ||
                          voices.find(voice => voice.lang.startsWith('de'));

      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Count total expressions
  const totalExpressions = expressionsData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="vocab-detail-container">
      {/* Control Row */}
      <header className="vocab-control-row">
        <div className="vocab-control-left">
          <button className="back-btn" onClick={onBack} title="Zurück zur Startseite" style={{ borderRadius: '8px', padding: '0 12px', width: 'auto', height: '40px', fontWeight: 700, fontSize: '14px' }}>
            Zurück
          </button>
          <div className="vocab-title-wrapper">
            <h2 className="vocab-title">Feste Ausdrücke</h2>
            <span className="vocab-subtitle">{totalExpressions} Ausdrücke</span>
          </div>
        </div>
      </header>

      {/* Main Content — Expressions grouped by category */}
      <main className="vocab-grid-main">
        <div className="expressions-wrapper">
          {expressionsData.map((category, catIdx) => (
            <div key={catIdx} className="expression-category-block">
              {/* Category Header */}
              <div className="expression-category-header">
                <h3 className="expression-category-title">{category.category}</h3>
              </div>

              {/* Expressions Table */}
              <div className="words-list expressions-list">
                <div className="words-list-header">
                  <div className="header-col-german">Deutsch</div>
                  <div className="header-col-translation">English</div>
                </div>
                {category.items.map((item) => (
                  <div key={item.id} className="word-row">
                    {/* Left: German Expression */}
                    <div 
                      className="word-row-german tts-clickable"
                      onClick={() => speakGerman(item.deutsch)}
                      title="Aussprache anhören (de-DE)"
                    >
                      <span className="german-text" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '48px', display: 'inline-block', opacity: 0.6 }}>{item.id})</span>
                        <span>{item.deutsch}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tts-icon" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </div>

                    {/* Right: English Translation */}
                    <div className="word-row-translation">
                      <span className="translation-text">{item.english}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
