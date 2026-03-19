
import React, { useState } from 'react';
import { VerificationRule } from '../types';

const RoleMapping: React.FC = () => {
  const [rules, setRules] = useState<VerificationRule[]>([
    { id: '1', roleName: 'Verified Holder', roleColor: '#10b981', condition: 'Owned', requirement: 1, collectionId: 'degods' },
    { id: '2', roleName: 'DeGod Whale', roleColor: '#059669', condition: 'Owned', requirement: 5, collectionId: 'degods' },
    { id: '3', roleName: 'Mad Lad OG', roleColor: '#047857', condition: 'Ranked Top', requirement: 100, collectionId: 'madlads' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Role Management</h2>
          <p className="text-slate-400">Map on-chain assets to Discord roles dynamically.</p>
        </div>
        <button className="px-6 py-3 canopy-gradient text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 leaf-border">
          <i className="fa-solid fa-plus"></i> New Mapping Rule
        </button>
      </header>

      <div className="glass rounded-2xl border border-emerald-900/20 overflow-hidden leaf-border organic-shadow">
        <table className="w-full text-left">
          <thead className="bg-emerald-900/20 text-emerald-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Discord Role</th>
              <th className="px-6 py-4 font-semibold">Collection</th>
              <th className="px-6 py-4 font-semibold">Requirement</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/20">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-emerald-900/10 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.roleColor }}></div>
                    <span className="font-semibold text-white">{rule.roleName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300 capitalize">
                  {rule.collectionId}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-900/30 rounded text-xs text-emerald-400 font-mono">
                    {rule.condition} ≥ {rule.requirement}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-emerald-400 text-xs">
                    <i className="fa-solid fa-circle text-[6px]"></i> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-emerald-900/30 rounded-lg transition">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 flex gap-6 items-start leaf-border">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
          <i className="fa-solid fa-lightbulb text-2xl"></i>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">Pro Tip: Automated Cleanup</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Enable "Sync Removal" in settings to automatically strip roles from users who sell their NFTs. 
            Canopy checks the blockchain every 15 minutes to ensure your community roles are always accurate.
          </p>
          <button className="mt-3 text-emerald-400 text-sm font-bold hover:underline">
            Go to Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleMapping;
