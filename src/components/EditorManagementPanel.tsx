import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ShieldAlert,
  X,
  FileText
} from 'lucide-react';

interface Editor {
  id: number;
  username: string;
  email: string;
  status: string;
  joined?: string;
}

interface EditorManagementPanelProps {
  setIsLoadingParent: (loading: boolean) => void;
}

export function EditorManagementPanel({ setIsLoadingParent }: EditorManagementPanelProps) {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/editors');
      const data = await res.json();
      if (data.success) {
        setEditors(data.editors);
      }
    } catch (e) {
      console.error("Error fetching editors:", e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const handleRemoveEditor = async (id: number, username: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে এডিটর "${username}" কে ব্যান/রিমুভ করতে চান?`)) {
      setIsLoadingParent(true);
      try {
        const res = await fetch('/api/admin/remove-editor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          alert(`✅ এডিটর "${username}" সফলভাবে রিমুভ করা হয়েছে!`);
          setEditors(editors.filter(e => e.id !== id));
        } else {
          alert('❌ রিমুভ করা সম্ভব হয়নি: ' + data.message);
        }
      } catch (e) {
        console.error(e);
        alert('❌ কানেকশন ব্যর্থ হয়েছে।');
      } finally {
        setIsLoadingParent(false);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800/80 mb-6 gap-2">
        <div>
          <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <Users size={22} /> 👤 Editor Management (Role-Based Access)
          </h2>
          <p className="text-slate-500 text-xs">প্ল্যাটফর্মের এডিটরদের অ্যাকাউন্ট লিস্ট ও পরিচালনা করুন</p>
        </div>
        <span className="text-sm bg-blue-900/40 text-blue-300 px-4 py-1.5 rounded-full font-bold border border-blue-800/50">
          Total Allowed: 2 | Active: {editors.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-800">
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {editors.map((editor) => (
              <tr key={editor.id} className="hover:bg-slate-900/40 transition">
                <td className="p-4 font-mono font-bold text-yellow-400">@{editor.username}</td>
                <td className="p-4 text-slate-300">{editor.email}</td>
                <td className="p-4">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-extrabold select-none">
                    {editor.status || 'Active'}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button 
                    onClick={() => setSelectedEditor(editor)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <FileText size={13} /> Details
                  </button>
                  <button 
                    onClick={() => handleRemoveEditor(editor.id, editor.username)}
                    className="bg-rose-600/10 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1"
                    title="Ban/Remove Editor"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {editors.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-medium italic">
                  কোনো সচল এডিটর অ্যাকাউন্ট পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL: EDITOR DETAILS ================= */}
      {selectedEditor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-950 p-6 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => { setSelectedEditor(null); setShowPassword(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-lg font-bold mb-5 text-blue-400 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wide">
              <User size={20} /> Editor Account Details
            </h3>
            
            <div className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Username</span>
                <p className="text-yellow-400 font-mono text-sm bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  @{selectedEditor.username}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Email Address</span>
                <p className="text-slate-300 text-sm bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  {selectedEditor.email}
                </p>
              </div>
              
              {/* পাসওয়ার্ড সিকিউরিটি টগল */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">System Password</p>
                  <p className="font-mono text-sm text-slate-300">
                    {showPassword ? "Encrypted_Pass123!" : "••••••••••••"}
                  </p>
                </div>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPassword ? "Hide" : "Reveal"}
                </button>
              </div>

              <div className="p-3.5 bg-slate-900/50 rounded-2xl border border-slate-800/80 space-y-2.5">
                <div>
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider block">Allowed Scope</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Accounts Creation, Warehouse Management, AirDrop Logs, Video Link Uploads.
                  </p>
                </div>
                <hr className="border-slate-800/60" />
                <div>
                  <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider block">Blocked Scope</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                    Auto-Pilot Core Control, Core Financials.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedEditor(null); setShowPassword(false); }}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer uppercase shadow-lg shadow-blue-500/10"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
