import React from 'react';
import { Shield, Globe, MapPin, Users, Database, Activity, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { NER_CULTURAL_DATABASE } from '../../data/ner_cultural';

export const AdminDashboard: React.FC = () => {
  const nerStateData = [
    { state: 'Assam', users: 145, centers: 12 },
    { state: 'Meghalaya', users: 62, centers: 5 },
    { state: 'Manipur', users: 48, centers: 4 },
    { state: 'Mizoram', users: 34, centers: 3 },
    { state: 'Nagaland', users: 52, centers: 4 },
    { state: 'Tripura', users: 58, centers: 5 },
    { state: 'Arunachal', users: 41, centers: 3 },
    { state: 'Sikkim', users: 28, centers: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>System Administrator & Regional Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit">NeuroSaathi Central Ecosystem</h1>
          <p className="text-purple-200 text-sm">Regional Healthcare & Accessibility Localization Control</p>
        </div>

        <div className="flex items-center space-x-3 bg-purple-950 p-3 rounded-2xl border border-purple-800">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-purple-300 font-bold">System Status</div>
            <div className="text-emerald-400 font-extrabold text-sm">Healthy & Operational</div>
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 font-bold text-xs uppercase">Total System Users</div>
          <div className="text-3xl font-black text-slate-900">468</div>
          <div className="text-xs text-purple-600 font-bold">Across 8 NER States</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 font-bold text-xs uppercase">Active Games</div>
          <div className="text-3xl font-black text-teal-700">8 Engines</div>
          <div className="text-xs text-teal-600 font-bold">AI Adaptive Enabled</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 font-bold text-xs uppercase">Supported Languages</div>
          <div className="text-3xl font-black text-indigo-700">3 Native</div>
          <div className="text-xs text-slate-500 font-bold">Assamese, Hindi, English</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 font-bold text-xs uppercase">Healthcare Centers</div>
          <div className="text-3xl font-black text-emerald-700">38 Hubs</div>
          <div className="text-xs text-emerald-600 font-bold">Connected</div>
        </div>
      </div>

      {/* State-Wise Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span>North Eastern Region Patient Distribution (8 States)</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">Anonymized Aggregated Analytics</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nerStateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="state" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="users" name="Registered Patients" fill="#6b21a8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="centers" name="Healthcare Hubs" fill="#0d9488" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NER Regional Cultural Content Manager */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>Regional Cultural Content Library</span>
          </h3>
          <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs">
            + Add Cultural Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {NER_CULTURAL_DATABASE.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex space-x-3 items-center">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              <div>
                <div className="font-extrabold text-slate-900 text-sm line-clamp-1">{item.name}</div>
                <div className="text-xs text-purple-700 font-bold">{item.state} • {item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
