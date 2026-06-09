import { useState } from 'react';
import './App.css';
import VocabularyContainer from './components/VocabularyContainer';
import { vocabularyWords, basicVocabularyWords } from './data/laundryVocabulary';

function App() {
  const [view, setView] = useState(null); // null, 'company', 'basic'

  return (
    <div className="app-container">
      {/* Navbar header */}
      <header className="navbar">
        <div className="navbar-left" style={{ cursor: 'pointer' }} onClick={() => setView(null)}>
          <h1 className="navbar-title">Zentralwäscherei</h1>
          <span className="navbar-subtitle">Chur</span>
        </div>
      </header>

      {/* Main Content Area - Full Screen Width & Responsive */}
      {view === null ? (
        <main className="content-area">
          <section className="hero-section">
            {/* Polymorphic/Watermark Background Words */}
            <div className="watermark-container">
              <div className="watermark word-respectful">respektvoll</div>
              <div className="watermark word-innovative">innovativ</div>
              <div className="watermark word-helpful">hilfsbereit</div>
              <div className="watermark word-exemplary">vorbildlich</div>
              <div className="watermark word-appreciation">Wertschätzung</div>
              <div className="watermark word-teamwork">Teamwork</div>
              <div className="watermark word-support">fördern</div>
              <div className="watermark word-eye-level">Augenhöhe</div>
              <div className="watermark word-sustainable">nachhaltig</div>
            </div>

            {/* Cards Grid */}
            <div className="vocab-cards-grid">
              
              {/* Card 1: Fachwortschatz - Betriebswortschatz (connected to 'company' data list) */}
              <div className="vocab-card card-company" onClick={() => setView('company')} style={{ cursor: 'pointer' }}>
                <span className="card-badge label-company">Fachwortschatz</span>
                <h2 className="card-title title-company">Betriebswortschatz</h2>
                <p className="card-desc">Wichtige Begriffe für den Alltag in der Wäscherei.</p>
                <div className="card-footer">
                  <span className="card-entries count-company">{basicVocabularyWords.length} Einträge</span>
                  <a href="#company" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('company'); }} className="card-action-link link-company">
                    Öffnen
                  </a>
                </div>
              </div>

              {/* Card 2: Allgemein - Grundwortschatz (connected to 'basic' data list) */}
              <div className="vocab-card card-basic" onClick={() => setView('basic')} style={{ cursor: 'pointer' }}>
                <span className="card-badge label-basic">Allgemein</span>
                <h2 className="card-title title-basic">Grundwortschatz</h2>
                <p className="card-desc">Grundlegende deutsche Wörter für den Alltag.</p>
                <div className="card-footer">
                  <span className="card-entries count-basic">{vocabularyWords.length} Einträge</span>
                  <a href="#basic" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('basic'); }} className="card-action-link link-basic">
                    Öffnen
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* Branding Footer */}
          <footer style={{ 
            padding: '24px 0', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 10
          }}>
            <a 
              href="https://www.upwork.com/freelancers/~018cb6b2be97dd2433" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: 400,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => e.target.style.color = '#64748b'}
              onMouseOut={(e) => e.target.style.color = '#94a3b8'}
            >
              Developed by Hashir Mehboob
            </a>
          </footer>
        </main>
      ) : (
        <VocabularyContainer vocabType={view} onBack={() => setView(null)} />
      )}
    </div>
  );
}

export default App;
