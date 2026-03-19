
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'collections', label: 'Collections', icon: 'fa-layer-group' },
    { id: 'roles', label: 'Role Mapping', icon: 'fa-user-tag' },
    { id: 'security', label: 'Security & Bot', icon: 'fa-shield-halved' },
    { id: 'ai-assistant', label: 'AI Strategy', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <aside className="w-64 glass border-r border-emerald-900/30 h-screen sticky top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 leaf-border">
          <i className="fa-solid fa-leaf text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white font-serif italic">CANOPY</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeView === item.id 
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:bg-emerald-900/20 hover:text-slate-100'
            }`}
          >
            <i className={`fa-solid ${item.icon} ${activeView === item.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
            <span className="font-medium">{item.label}</span>
            {activeView === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
          <img src="https://picsum.photos/seed/admin/40/40" className="w-10 h-10 rounded-lg" alt="User" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">MatricaAdmin.sol</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
