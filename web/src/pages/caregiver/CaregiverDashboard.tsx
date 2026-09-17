import React, { useState, useEffect } from 'react';
import { Users, Brain, Bell, Calendar, Heart, ShieldAlert, Mic, CheckCircle, ArrowUpRight, BarChart3, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { api, CaregiverDashboardData } from '../../services/api';

export const CaregiverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'analytics' | 'reminders' | 'memory' | 'alerts'>('dashboard');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<number[]>([]);
  const [dashboardData, setDashboardData] = useState<CaregiverDashboardData | null>(null);

  useEffect(() => {
    api.getCaregiverDashboard().then((data) => {
      setDashboardData(data);
    }).catch(console.error);
  }, []);

  // Weekly performance chart data
  const weeklyTrends = [
    { day: 'Mon', memory: 75, attention: 68, adherence: 90 },
    { day: 'Tue', memory: 82, attention: 74, adherence: 100 },
    { day: 'Wed', memory: 78, attention: 70, adherence: 85 },
    { day: 'Thu', memory: 85, attention: 79, adherence: 95 },
    { day: 'Fri', memory: 80, attention: 72, adherence: 90 },
    { day: 'Sat', memory: 88, attention: 82, adherence: 100 },
    { day: 'Sun', memory: 84, attention: 76, adherence: 90 },
  ];

  const moodData = [
    { name: 'Happy 😊', value: 45, color: '#22c55e' },
    { name: 'Okay 🙂', value: 35, color: '#0d9488' },
    { name: 'Worried 😟', value: 12, color: '#f59e0b' },
    { name: 'Sad 😢', value: 8, color: '#ef4444' },
  ];

  const alertsList = [
    { id: 1, type: 'STREAK_MILESTONE', severity: 'info', message: 'Kamala Devi completed 5 consecutive daily cognitive sessions!', time: 'Today', patient: 'Kamala Devi' },
    { id: 2, type: 'POSITIVE_TREND', severity: 'normal', message: 'Visual memory accuracy improved +12% over the last 7 sessions.', time: 'Yesterday', patient: 'Kamala Devi' },
    { id: 3, type: 'UNUSUAL_VARIATION', severity: 'medium', message: 'Slight decline in response speed during late evening session. Suggest morning exercises.', time: '2 days ago', patient: 'Kamala Devi' },
  ];

  const toggleAcknowledge = (id: number) => {
    setAcknowledgedAlerts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 space-y-6 flex-shrink-0 border-r border-slate-800">
        <div className="flex items-center space-x-3 text-white px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md">
            N
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wide text-white">NeuroSaathi</div>
            <div className="text-xs text-teal-400 font-semibold">Caregiver Portal</div>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
            { key: 'patients', label: 'Linked Patients', icon: <Users className="w-5 h-5" /> },
            { key: 'analytics', label: 'Cognitive Analytics', icon: <Brain className="w-5 h-5" /> },
            { key: 'reminders', label: 'Routine & Reminders', icon: <Calendar className="w-5 h-5" /> },
            { key: 'memory', label: 'Memory Capsule', icon: <Heart className="w-5 h-5" /> },
            { key: 'alerts', label: 'Alerts', icon: <Bell className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.key
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="bg-slate-800 rounded-2xl p-3 border border-slate-700 text-xs space-y-1">
          <div className="text-slate-400 font-bold uppercase">Caregiver</div>
          <div className="text-white font-extrabold">{dashboardData?.caregiver.name || 'Ananya Devi'}</div>
          <div className="text-slate-400">Linked: {dashboardData?.patient.name || 'Kamala Devi'} (Mother)</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-outfit">Caregiver Control Center</h1>
            <p className="text-slate-600 text-sm font-medium">
              Monitoring routine adherence and cognitive activity for {dashboardData?.patient.name || 'Kamala Devi'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Status: Active &amp; Healthy</span>
            </span>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Linked Patient</div>
            <div className="text-2xl font-black text-slate-900">{dashboardData?.patient.name || 'Kamala Devi'}</div>
            <div className="text-xs text-emerald-600 font-bold">Age: 72 • Guwahati</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Cognitive Streak</div>
            <div className="text-3xl font-black text-teal-700">{dashboardData?.patient.streak_days || 5} Days 🔥</div>
            <div className="text-xs text-slate-500 font-bold">Level: {dashboardData?.patient.current_difficulty || 'Easy'}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Routine Adherence</div>
            <div className="text-3xl font-black text-emerald-700">{dashboardData?.adherence_rate || 85}%</div>
            <div className="text-xs text-emerald-600 font-bold">All morning tasks done</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Memory Score</div>
            <div className="text-3xl font-black text-indigo-700">{dashboardData?.patient.memory_score || 78}/100</div>
            <div className="text-xs text-slate-500 font-bold">+8% over last week</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Performance Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Weekly Memory & Attention Trends</h3>
              <span className="text-xs text-slate-500 font-bold">Last 7 Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="memory" name="Memory Match" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="attention" name="Attention" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Trend Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Self-Reported Well-being</h3>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-xs text-slate-500 text-center font-medium">
              80% positive well-being logged this past week.
            </div>
          </div>
        </div>

        {/* Alerts & Notifications Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Caregiver Alerts &amp; Non-Clinical Notifications</span>
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 font-bold px-3 py-1 rounded-full border border-amber-200">
              Support &amp; Reassurance
            </span>
          </div>

          <div className="space-y-3">
            {alertsList.map((alt) => {
              const isAck = acknowledgedAlerts.includes(alt.id);
              return (
                <div
                  key={alt.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isAck ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-amber-50/60 border-amber-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isAck ? 'text-slate-400' : 'text-amber-600'}`} />
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{alt.message}</div>
                      <div className="text-xs text-slate-500 font-medium">Patient: {alt.patient} • {alt.time}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAcknowledge(alt.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isAck
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow'
                    }`}
                  >
                    {isAck ? 'Acknowledged ✓' : 'Acknowledge'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Non-Clinical Medical Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-200 text-slate-700 text-xs leading-relaxed border border-slate-300">
          <strong>Non-Clinical Disclaimer:</strong> NeuroSaathi is a cognitive wellness and daily routine companion. It does not provide medical diagnosis, clinical evaluation, or prescribe treatment. If you notice persistent confusion or cognitive distress, consult a certified geriatric specialist or physician.
        </div>

      </div>
    </div>
  );
};
