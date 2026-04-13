"use client";
import { useEffect, useState } from "react";
// ✅ AJUSTADO: Sobe dois níveis (../../) para encontrar a pasta services na raiz
import api from "../../services/api";
import { Users, UserPlus, Shield, Mail, Trash2, CheckCircle } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "operator" });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users"); 
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Erro ao carregar utilizadores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", newUser);
      alert("Utilizador criado com sucesso!");
      setShowModal(false);
      setNewUser({ name: "", email: "", password: "", role: "operator" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao criar utilizador");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14]">
      <div className="p-8 text-emerald-500 font-mono animate-pulse uppercase tracking-widest text-xs">
        Acedendo Base de Dados Soberana...
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[#080c14] min-h-screen">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Gestão de <span className="text-emerald-500">Acessos</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-mono uppercase mt-1 tracking-widest">Controlo de Permissões da Empresa</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase transition-all shadow-lg shadow-emerald-900/20"
        >
          <UserPlus size={16} /> Novo Utilizador
        </button>
      </header>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-slate-800">
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Utilizador</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Nível de Acesso</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {users.length === 0 ? (
              <tr><td colSpan="4" className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">Nenhum utilizador secundário encontrado.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 font-bold uppercase border border-emerald-500/20">
                        {u.name ? u.name[0] : "?"}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm uppercase tracking-tight">{u.name}</p>
                        <p className="text-slate-500 text-[10px] font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-slate-900/80 text-emerald-500 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter border border-emerald-500/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      Ativo
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-slate-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-black">
            <h2 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter">Registrar Novo Acesso</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input 
                placeholder="NOME COMPLETO" 
                className="w-full bg-black/50 border border-slate-800 p-4 rounded-2xl text-white text-xs font-bold outline-none focus:border-emerald-500 transition-all uppercase placeholder:text-slate-700"
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                required
              />
              <input 
                type="email" placeholder="EMAIL CORPORATIVO" 
                className="w-full bg-black/50 border border-slate-800 p-4 rounded-2xl text-white text-xs font-bold outline-none focus:border-emerald-500 transition-all uppercase placeholder:text-slate-700"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input 
                type="password" placeholder="SENHA TEMPORÁRIA" 
                className="w-full bg-black/50 border border-slate-800 p-4 rounded-2xl text-white text-xs font-bold outline-none focus:border-emerald-500 transition-all uppercase placeholder:text-slate-700"
                value={newUser.password}
                onChange={e => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <select 
                className="w-full bg-black/50 border border-slate-800 p-4 rounded-2xl text-white text-xs font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer uppercase"
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="operator">OPERADOR (APENAS LEITURA)</option>
                <option value="manager">GESTOR (APROVAÇÃO)</option>
                <option value="admin">ADMINISTRADOR (TOTAL)</option>
              </select>
              
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[9px] tracking-widest hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl uppercase text-[9px] tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40">Confirmar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
