
import React, { useState } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Command {
  id: string;
  name: string;
  description: string;
  accessLevel: 'Everyone' | 'Verified' | 'Admin';
}

const SecurityBot: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: '1', name: 'Manage Roles', description: 'Allows the bot to assign and remove roles from members.', enabled: true },
    { id: '2', name: 'Send Messages', description: 'Allows the bot to send verification links and notifications.', enabled: true },
    { id: '3', name: 'Manage Webhooks', description: 'Allows the bot to send logs to specific channels.', enabled: false },
    { id: '4', name: 'View Audit Log', description: 'Allows the bot to track security events.', enabled: true },
  ]);

  const [commands, setCommands] = useState<Command[]>([
    { id: '1', name: '/verify', description: 'Start the wallet verification process.', accessLevel: 'Everyone' },
    { id: '2', name: '/stats', description: 'View community holder statistics.', accessLevel: 'Verified' },
    { id: '3', name: '/admin-sync', description: 'Force sync all roles for the server.', accessLevel: 'Admin' },
  ]);

  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [logChannel, setLogChannel] = useState('#bot-logs');
  const [syncRemoval, setSyncRemoval] = useState(true);
  const [raidModeEnabled, setRaidModeEnabled] = useState(true);
  const [vpnDetectionEnabled, setVpnDetectionEnabled] = useState(true);
  const [accountAgeFilterEnabled, setAccountAgeFilterEnabled] = useState(true);
  const [showRaidConfirmation, setShowRaidConfirmation] = useState(false);

  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleRaidToggleClick = () => {
    setShowRaidConfirmation(true);
  };

  const confirmRaidToggle = () => {
    setRaidModeEnabled(!raidModeEnabled);
    setShowRaidConfirmation(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Canopy Bot Settings</h2>
          <p className="text-slate-400">Configure your Discord bot's permissions, commands, and security protocols.</p>
        </div>
        <a 
          href="https://discord.com/api/oauth2/authorize?client_id=1234567890&permissions=8&scope=bot%20applications.commands" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl canopy-gradient text-white font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 leaf-border hover:scale-105 active:scale-95 no-underline"
        >
          <i className="fa-brands fa-discord text-xl"></i>
          Invite Canopy Bot
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bot Permissions Section */}
        <div className="glass rounded-2xl border border-emerald-900/20 p-6 space-y-6 leaf-border organic-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-key text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Bot Permissions</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="space-y-4">
            {permissions.map((perm) => (
              <div key={perm.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-900/10 border border-emerald-900/20 hover:border-emerald-500/30 transition-colors">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-semibold text-white">{perm.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                </div>
                <button 
                  onClick={() => togglePermission(perm.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${perm.enabled ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${perm.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-emerald-900/20">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
              <div>
                <p className="text-xs font-semibold text-amber-400">Security Warning</p>
                <p className="text-[11px] text-amber-400/70 mt-0.5">
                  Ensure the bot role is positioned above the roles it needs to manage in your Discord server settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bot Commands Section */}
        <div className="glass rounded-2xl border border-emerald-900/20 p-6 space-y-6 leaf-border organic-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                <i className="fa-solid fa-terminal text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Slash Commands</h3>
            </div>
            <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Add Custom
            </button>
          </div>

          <div className="space-y-4">
            {commands.map((cmd) => (
              <div key={cmd.id} className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-900/20 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{cmd.name}</code>
                  <select 
                    className="bg-slate-900 border border-emerald-900/30 text-[11px] rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                    defaultValue={cmd.accessLevel}
                  >
                    <option>Everyone</option>
                    <option>Verified</option>
                    <option>Admin</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400">{cmd.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-emerald-900/20">
             <button className="w-full py-3 rounded-xl bg-emerald-900/20 text-white text-sm font-bold hover:bg-emerald-900/40 transition-all border border-emerald-900/30">
                Sync Commands with Discord
             </button>
          </div>
        </div>
      </div>

      {/* Command Logging Section */}
      <div className="glass rounded-2xl border border-emerald-900/20 p-6 leaf-border organic-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-list-ul text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Command Logging</h3>
              <p className="text-xs text-slate-400">Track all bot interactions and command executions.</p>
            </div>
          </div>
          <button 
            onClick={() => setLoggingEnabled(!loggingEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${loggingEnabled ? 'bg-emerald-600' : 'bg-slate-800'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${loggingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${loggingEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300 mb-2 block">Log Channel</span>
              <div className="relative">
                <select 
                  value={logChannel}
                  onChange={(e) => setLogChannel(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  <option value="#bot-logs">#bot-logs</option>
                  <option value="#admin-only">#admin-only</option>
                  <option value="#security-audit">#security-audit</option>
                  <option value="#general">#general</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </label>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-400 leading-relaxed">
                <i className="fa-solid fa-circle-info mr-2"></i>
                Logs will include the user ID, command name, timestamp, and execution status.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-900/20">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-900/10 border border-emerald-900/20 hover:border-emerald-500/30 transition-colors">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-semibold text-white">Sync Removal</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Automatically remove roles when criteria are no longer met.</p>
                </div>
                <button 
                  onClick={() => setSyncRemoval(!syncRemoval)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${syncRemoval ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${syncRemoval ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-slate-300 mb-2 block">Events to Log</span>
            {[
              { label: 'Successful Commands', enabled: true },
              { label: 'Failed Commands', enabled: true },
              { label: 'Admin Override Actions', enabled: true },
              { label: 'Role Sync Events', enabled: false },
            ].map((event, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900/20 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  defaultChecked={event.enabled}
                  className="w-4 h-4 rounded border-emerald-900/30 bg-slate-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900" 
                />
                <span className="text-sm text-slate-300">{event.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Security Section */}
      <div className="glass rounded-2xl border border-emerald-900/20 p-8 leaf-border organic-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-serif italic">Advanced Security Protocols</h3>
            <p className="text-slate-400 text-sm max-w-2xl">
              Enable additional layers of protection for your community, including anti-phishing measures and automated raid detection.
            </p>
          </div>
          <div className="flex gap-3">
             <div className="flex flex-col items-center gap-1">
                <button className="px-6 py-3 rounded-xl canopy-gradient hover:opacity-90 text-white font-bold transition shadow-lg shadow-emerald-500/20 leaf-border">
                  Enable Anti-Raid
                </button>
                <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Recommended</span>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { 
              title: 'VPN Detection', 
              status: vpnDetectionEnabled ? 'Enabled' : 'Disabled', 
              icon: 'fa-network-wired', 
              color: vpnDetectionEnabled ? 'text-emerald-400' : 'text-slate-500',
              enabled: vpnDetectionEnabled,
              onToggle: () => setVpnDetectionEnabled(!vpnDetectionEnabled)
            },
            { 
              title: 'Account Age Filter', 
              status: accountAgeFilterEnabled ? '7 Days' : 'Off', 
              icon: 'fa-calendar-check', 
              color: accountAgeFilterEnabled ? 'text-green-400' : 'text-slate-500',
              enabled: accountAgeFilterEnabled,
              onToggle: () => setAccountAgeFilterEnabled(!accountAgeFilterEnabled)
            },
            { 
              title: 'Raid Mode', 
              status: raidModeEnabled ? 'Enabled' : 'Off', 
              icon: 'fa-shield-virus', 
              color: raidModeEnabled ? 'text-red-400' : 'text-slate-500',
              enabled: raidModeEnabled,
              onToggle: handleRaidToggleClick
            },
          ].map((item, i) => (
            <div 
              key={i} 
              className={`p-5 rounded-2xl bg-emerald-900/10 border border-emerald-900/20 flex flex-col gap-4 transition-all hover:border-emerald-500/30 organic-shadow`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center ${item.color} text-xl`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <button 
                  onClick={item.onToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.enabled ? (item.title === 'Raid Mode' ? 'bg-red-600' : 'bg-emerald-600') : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.title}</p>
                <p className="text-lg font-bold text-white mt-1">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raid Mode Confirmation Modal */}
      {showRaidConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass max-w-md w-full p-8 rounded-3xl border border-emerald-500/30 leaf-border organic-shadow space-y-6">
            <div className="flex items-center gap-4 text-red-400">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Security Action</h3>
            </div>
            
            <p className="text-slate-400 leading-relaxed">
              {raidModeEnabled 
                ? "Are you sure you want to disable Raid Mode? This will lower the verification threshold and allow new members to join without additional scrutiny."
                : "Enabling Raid Mode will immediately lock down the server, requiring manual approval for all new members and blocking accounts less than 30 days old."}
            </p>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setShowRaidConfirmation(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRaidToggle}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${raidModeEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}
              >
                {raidModeEnabled ? 'Disable' : 'Enable Raid Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityBot;
