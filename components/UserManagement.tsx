
import React, { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { User as UserIcon, Shield, Trash2, Mail, BadgeCheck } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

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
      </div>

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
