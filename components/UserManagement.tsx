
import React, { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { User as UserIcon, Shield, Trash2, Mail, BadgeCheck, Plus, X, UserPlus, Lock } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDeNXMvX2eMAAoIz4Gkk4hYkyHNKqJAGpE",
  authDomain: "etiquetas-modulos.firebaseapp.com",
  projectId: "etiquetas-modulos",
  storageBucket: "etiquetas-modulos.firebasestorage.app",
  messagingSenderId: "342555028363",
  appId: "1:342555028363:web:4498e953a2011a0841dd8e"
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'user' as 'admin' | 'user' });
  const [registering, setRegistering] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`Alterar cargo de ${user.name} para ${newRole}?`)) {
      await updateDoc(doc(db, 'users', user.uid), { role: newRole });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setRegistering(true);

    let secondaryApp;
    try {
      // Initialize secondary app to create user without logging out the admin
      secondaryApp = getApps().find(app => app.name === 'SecondaryApp') || initializeApp(firebaseConfig, 'SecondaryApp');
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserData.email, newUserData.password);
      const newUser = userCredential.user;

      const profile: UserProfile = {
        uid: newUser.uid,
        email: newUserData.email,
        name: newUserData.name,
        role: newUserData.role
      };

      await setDoc(doc(db, 'users', newUser.uid), profile);
      
      // Cleanup: Sign out the secondary app and close
      await signOut(secondaryAuth);
      
      setShowAddModal(false);
      setNewUserData({ name: '', email: '', password: '', role: 'user' });
      alert("Novo usuário cadastrado com sucesso!");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setFormError('Este e-mail já está cadastrado.');
      else if (err.code === 'auth/weak-password') setFormError('A senha deve ter pelo menos 6 caracteres.');
      else setFormError('Erro ao criar usuário: ' + err.message);
    } finally {
      setRegistering(false);
    }
  };

  const deleteUser = async (uid: string) => {
    if (confirm("Remover este usuário do banco de dados? (Nota: Isso não exclui a conta de login do Firebase, apenas o perfil)")) {
      await deleteDoc(doc(db, 'users', uid));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Gestão de Usuários</h2>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Controle de acesso e permissões do sistema</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleAddUser} className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white uppercase">Adicionar Colaborador</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-8 space-y-6">
              {formError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest">
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 outline-none" placeholder="Ex: Lucas Mendes" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" required value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 outline-none" placeholder="usuario@scania.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha Provisória</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" required value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 outline-none" placeholder="••••••••" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['user', 'admin'] as const).map(role => (
                  <button 
                    key={role} 
                    type="button" 
                    onClick={() => setNewUserData({...newUserData, role})}
                    className={`py-3 rounded-xl text-[10px] font-bold uppercase border transition-all ${newUserData.role === role ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/30">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white">Cancelar</button>
              <button 
                type="submit" 
                disabled={registering}
                className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {registering ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cargo</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {users.map((item) => (
              <tr key={item.uid} className="group hover:bg-slate-800/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">{item.name}</span>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">UID: {item.uid.slice(0, 8)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-600" />
                    {item.email}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    item.role === 'admin' 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {item.role === 'admin' ? <Shield className="w-3 h-3" /> : <BadgeCheck className="w-3 h-3" />}
                    {item.role}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => toggleRole(item)}
                            className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                            title="Alterar Cargo"
                        >
                            <Shield className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => deleteUser(item.uid)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Remover"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
          <p className="text-xs text-indigo-300 leading-relaxed italic">
            **Nota de Segurança:** Novos usuários que se cadastrarem no sistema entram automaticamente com o cargo de "User". 
            Apenas administradores podem promover outros usuários para "Admin".
          </p>
      </div>
    </div>
  );
};

export default UserManagement;
