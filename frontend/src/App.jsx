import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import InterestForm from './pages/InterestForm';

/** Renders the persistent site shell and currently available application routes. */
function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<InterestForm />} />
          <Route path="/admin" element={<p>Administrator access coming soon.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
