
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', holders: 4000 },
  { name: 'Tue', holders: 4200 },
  { name: 'Wed', holders: 4100 },
  { name: 'Thu', holders: 4800 },
  { name: 'Fri', holders: 5100 },
  { name: 'Sat', holders: 5300 },
  { name: 'Sun', holders: 5600 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Server Overview</h2>
          <p className="text-slate-400">Real-time status of your Canopy-linked community.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-900/20 rounded-lg border border-emerald-900/30 hover:bg-emerald-900/40 transition text-emerald-400">
            <i className="fa-solid fa-download mr-2"></i> Export Report
          </button>
          <button className="px-4 py-2 canopy-gradient text-white rounded-lg transition shadow-lg shadow-emerald-500/20 leaf-border font-bold">
            <i className="fa-solid fa-plus mr-2"></i> Add Collection
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Verified', value: '1,284', delta: '+12%', icon: 'fa-check-double', color: 'text-emerald-400' },
          { label: 'Wallet Links', value: '2,491', delta: '+5%', icon: 'fa-wallet', color: 'text-green-400' },
          { label: 'Roles Assigned', value: '3,812', delta: '+18%', icon: 'fa-tags', color: 'text-lime-400' },
          { label: 'Security Score', value: '98/100', delta: 'Stable', icon: 'fa-shield-heart', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-emerald-900/20 hover:border-emerald-500/30 transition-all group leaf-border organic-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-emerald-900/20 ${stat.color} transition-transform group-hover:scale-110`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.delta.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                {stat.delta}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl border border-emerald-900/20 p-6 leaf-border organic-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white font-serif italic">Holder Growth</h3>
            <select className="bg-emerald-900/20 border border-emerald-900/30 text-sm rounded-lg px-3 py-1 text-emerald-400 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHolders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                <XAxis dataKey="name" stroke="#059669" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#059669" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#064e3b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="holders" stroke="#10b981" fillOpacity={1} fill="url(#colorHolders)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl border border-emerald-900/20 p-6 leaf-border organic-shadow">
          <h3 className="text-lg font-bold text-white mb-6 font-serif italic">Top Collections</h3>
          <div className="space-y-4">
            {[
              { name: 'DeGods', floor: '412 SOL', count: 120, img: 'https://picsum.photos/seed/degods/40/40' },
              { name: 'Mad Lads', floor: '185 SOL', count: 85, img: 'https://picsum.photos/seed/madlads/40/40' },
              { name: 'Claynosaurz', floor: '92 SOL', count: 42, img: 'https://picsum.photos/seed/claynosaurz/40/40' },
              { name: 'Famous Fox', floor: '65 SOL', count: 31, img: 'https://picsum.photos/seed/foxes/40/40' },
            ].map((col, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-900/20 transition border border-transparent hover:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <img src={col.img} className="w-10 h-10 rounded-lg object-cover leaf-border" alt={col.name} />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{col.name}</h4>
                    <p className="text-xs text-slate-500">{col.count} holders verified</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{col.floor}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-xl text-emerald-400 text-sm font-medium hover:bg-emerald-400/10 transition">
            View All Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
