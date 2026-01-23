
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  browserLocalPersistence,
  setPersistence 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Cpu, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, User } from 'lucide-react';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // E-mail ou Nome de Usuário
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loginEmail = identifier;

      // Se não for um formato de e-mail, procuramos pelo nome no banco
      if (!identifier.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('name', '==', identifier), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('Usuário não encontrado.');
        }

        const userData = querySnapshot.docs[0].data();
        loginEmail = userData.email;
      }

      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, loginEmail, password);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Usuário não encontrado.') {
        setError('Nome de usuário não encontrado no sistema.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Acesso negado: Credenciais incorretas.');
      } else {
        setError('Erro de conexão ou técnico no acesso.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#0f172a] border border-slate-800 rounded-[40px] p-10 shadow-2xl">
            <div className="bg-indigo-600 p-0 rounded-3xl mb-6 shadow-xl shadow-indigo-900/40 overflow-hidden">
              <img src="/icon.png" alt="Logo" className="w-16 h-16 object-cover" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Central Stock & Tag
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
              Management & Tracking System
            </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail ou Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="E-mail ou Nome cadastrado"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Central Truck • Official Workflow Solution - V1.5
        </p>
      </div>
    </div>
  );
};

export default Login;
