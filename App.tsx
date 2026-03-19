
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoleMapping from './components/RoleMapping';
import AISettings from './components/AISettings';
import SecurityBot from './components/SecurityBot';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'roles': return <RoleMapping />;
      case 'security': return <SecurityBot />;
      case 'ai-assistant': return <AISettings />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl">
            <i className="fa-solid fa-hammer"></i>
          </div>
          <h2 className="text-2xl font-bold">Under Construction</h2>
          <p className="text-slate-400 max-w-sm">This module is currently being built by our engineering team to provide the best verification experience.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080a08]">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 glass border-b border-emerald-900/30 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
             <span className="text-sm font-medium text-slate-400">Solana Network: <span className="text-white">Active</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="p-2.5 rounded-xl bg-emerald-900/20 text-slate-400 hover:text-white transition-colors border border-emerald-900/30">
                <i className="fa-solid fa-bell"></i>
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
            </div>
            
            <button 
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border shadow-lg leaf-border ${
                isWalletConnected 
                  ? 'bg-emerald-900/40 text-white border-emerald-800 hover:bg-emerald-800' 
                  : 'canopy-gradient hover:opacity-90 text-white border-emerald-500 shadow-emerald-600/20'
              }`}
            >
              <i className={`fa-solid ${isWalletConnected ? 'fa-wallet' : 'fa-link'}`}></i>
              {isWalletConnected ? '0x8f...3a2e' : 'Connect Wallet'}
            </button>
          </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto w-full">
          {renderView()}
        </section>

        <footer className="mt-auto py-8 px-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
          <p>© 2024 Canopy Protocol. Inspired by Matrica Labs. Built for the future of Web3 Communities.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
