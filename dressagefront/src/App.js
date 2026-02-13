import './App.css';
import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    // Background light l'page kamla bach t-bayni l'alwan dyal l'form
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans antialiased">
      
      {/* 1. Navigation / Header */}
      <Header />

      {/* 2. Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hna fin ghadi t-afficha l'formulaire dyal l'citoyen */}
        <RegisterPage />
      </main>

      {/* 3. Bottom Area / Footer */}
      <Footer />
      
    </div>
  );
}

export default App;