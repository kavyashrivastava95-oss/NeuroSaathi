import React, { useState, useEffect } from 'react';
import { UserCheck, Stethoscope, AlertTriangle, FileText, Plus, ChevronRight, Activity, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface PatientSummary {
  id: string;
  name: string;
  age: number;
  region: string;
  difficulty: string;
  trend: string;
  adherence: string;
  memory_score?: number;
  lastActive: string;
}

interface ClinicalNote {
  id: number;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  note: string;
  created_at: string;
}

export const HealthcareDashboard: React.FC = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([
    { id: 'kamala_devi', name: 'Kamala Devi', age: 72, region: 'Assam', difficulty: 'Medium', trend: 'Stable', adherence: '92%', memory_score: 78, lastActive: 'Today' },
    { id: 'biren_gogoi', name: 'Biren Gogoi', age: 76, region: 'Assam', difficulty: 'Easy', trend: 'Needs Review', adherence: '78%', memory_score: 68, lastActive: 'Yesterday' }
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('kamala_devi');
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const loadData = async () => {
    try {
      setIsLoading(true);
      const patientList = await api.getHealthcarePatients();
      if (patientList && patientList.length > 0) {
        setPatients(patientList);
      }
      const noteList = await api.getClinicalNotes(selectedPatientId);
      if (noteList) {
        setNotes(noteList);
      }
    } catch {
      // Fallback intact
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPatientId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteText = newNote.trim();
    setNewNote('');

    try {
      const res = await api.addClinicalNote({
        patient_id: selectedPatientId,
        doctor_id: 'dr_barua',
        doctor_name: 'Dr. Biren Barua',
        note: noteText
      });

      if (res && res.note) {
        setNotes([res.note, ...notes]);
      } else {
        setNotes([
          {
            id: Date.now(),
            patient_id: selectedPatientId,
            doctor_id: 'dr_barua',
            doctor_name: 'Dr. Biren Barua',
            note: noteText,
            created_at: new Date().toISOString()
          },
          ...notes
        ]);
      }
    } catch {
      setNotes([
        {
          id: Date.now(),
          patient_id: selectedPatientId,
          doctor_id: 'dr_barua',
          doctor_name: 'Dr. Biren Barua',
          note: noteText,
          created_at: new Date().toISOString()
        },
        ...notes
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Healthcare Professional Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Dr. Biren Barua — Geriatric Neurology</h1>
          <p className="text-slate-400 text-sm">Guwahati Neurological Care Center (Assam Region)</p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800 p-3 rounded-2xl border border-slate-700">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-emerald-400">{patients.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Assigned</div>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="text-center px-2">
            <div className="text-2xl font-black text-amber-400">
              {patients.filter((p) => p.trend !== 'Stable').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Requires Review</div>
          </div>
          <button
            onClick={loadData}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-all ml-2"
            title="Refresh patient list & notes"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <span>Assigned Patient Directory</span>
          </h3>

          <div className="space-y-3">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPatientId === p.id
                    ? 'bg-teal-50 border-teal-600 shadow-md'
                    : 'bg-white border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-extrabold text-slate-900 text-base">{p.name}</div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    p.trend === 'Stable' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {p.trend}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Age {p.age} • {p.region} • Adherence: <strong className="text-slate-800">{p.adherence}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Patient Review & Notes Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{selectedPatient.name} — Longitudinal Overview</h2>
                <p className="text-slate-500 text-xs font-medium">
                  Caregiver: Ananya Devi (Daughter) • Level: {selectedPatient.difficulty} • Region: {selectedPatient.region}
                </p>
              </div>

              <div className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                Non-Diagnostic Clinical Support
              </div>
            </div>

            {/* Cognitive Activity Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">Memory Score</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{selectedPatient.memory_score || 78}%</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">Attention</div>
                <div className="text-2xl font-black text-teal-700 mt-1">
                  {selectedPatient.id === 'kamala_devi' ? '64%' : '58%'}
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">Recognition</div>
                <div className="text-2xl font-black text-blue-700 mt-1">
                  {selectedPatient.id === 'kamala_devi' ? '81%' : '70%'}
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">Adherence</div>
                <div className="text-2xl font-black text-indigo-700 mt-1">{selectedPatient.adherence}</div>
              </div>
            </div>

            {/* Clinical Follow-up Notes */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Doctor Observation &amp; Care Directives</span>
              </h3>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={`Add clinical note for ${selectedPatient.name}...`}
                  className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-2xl shadow text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
              </form>

              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {notes.map((n) => (
                  <div key={n.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium space-y-1">
                    <div className="text-slate-900 font-bold">"{n.note}"</div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      Recorded by {n.doctor_name || 'Dr. Biren Barua'} • {n.created_at ? n.created_at.split('T')[0] : 'Today'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
