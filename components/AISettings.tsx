
import React, { useState } from 'react';
import { generateCommunityStrategy } from '../services/geminiService';

const AISettings: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await generateCommunityStrategy(description);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error generating strategy. Make sure your API key is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">AI Community Architect</h2>
        <p className="text-slate-400">Let Gemini suggest the perfect role hierarchy and engagement strategy based on your NFT project's goals.</p>
      </header>

      <div className="glass rounded-2xl border border-emerald-900/20 p-8 space-y-6 leaf-border organic-shadow">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Project Description & Roadmap</label>
          <textarea
            className="w-full bg-slate-900 border border-emerald-900/30 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px] transition"
            placeholder="Tell us about your NFT collection, its utility, and your target audience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading || !description}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition shadow-lg ${
            loading ? 'bg-slate-800 text-slate-500' : 'canopy-gradient hover:opacity-90 text-white shadow-emerald-500/20 leaf-border'
          }`}
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          )}
          {loading ? 'Analyzing Project...' : 'Generate Community Strategy'}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="glass rounded-2xl border border-emerald-500/30 p-8 leaf-border organic-shadow">
            <h3 className="text-xl font-bold text-white mb-4 font-serif italic">Recommended Strategy</h3>
            <p className="text-slate-300 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-2">
              "{result.strategy}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl border border-emerald-900/20 p-8 leaf-border organic-shadow">
              <h3 className="text-lg font-bold text-white mb-4 font-serif italic">Proposed Roles</h3>
              <div className="space-y-4">
                {result.roles.map((role: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-900/10 rounded-xl border border-emerald-900/20">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: role.color }}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{role.name}</p>
                      <p className="text-xs text-slate-500">{role.requirement}</p>
                    </div>
                    <button className="text-emerald-400 text-xs font-bold hover:underline">Apply</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl border border-emerald-900/20 p-8 leaf-border organic-shadow">
              <h3 className="text-lg font-bold text-white mb-4 font-serif italic">Engagement Hacks</h3>
              <ul className="space-y-4">
                {result.engagementIdeas.map((idea: string, i: number) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISettings;
