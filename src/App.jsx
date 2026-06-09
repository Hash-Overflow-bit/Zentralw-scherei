import { useState } from 'react';
import './App.css';
import HelloGillLogo from './components/HelloGillLogo';
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
        <div className="navbar-right" style={{ cursor: 'pointer' }} onClick={() => setView(null)}>
          <HelloGillLogo />
        </div>
      </header>

      {/* Main Content Area - Full Screen Width & Responsive */}
      {view === null ? (
        <main className="content-area">
          <section className="hero-section">
            {/* Cards Grid */}
            <div className="vocab-cards-grid">
              
              {/* Card 1: Fachwortschatz - Betriebswortschatz (connected to 'company' data list) */}
              <div className="vocab-card card-company" onClick={() => setView('company')} style={{ cursor: 'pointer' }}>
                <h2 className="card-title title-company" style={{ marginBottom: 0 }}>Vokabular ZWC</h2>
              </div>

              {/* Card 2: Allgemein - Grundwortschatz (connected to 'basic' data list) */}
              <div className="vocab-card card-basic" onClick={() => setView('basic')} style={{ cursor: 'pointer' }}>
                <h2 className="card-title title-basic" style={{ marginBottom: 0 }}>Vokabular Deutsch</h2>
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
