'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Group } from '@/lib/types';
import { GroupSchema } from '@/lib/validations';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  AlertCircle,
  Upload,
  MessageCircle,
  ExternalLink,
  X,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

const defaultGroupsList: Group[] = [
  {
    id: 'g1',
    title: 'Grupo 1 - Ofertas Diárias',
    description: 'Principais cupons de desconto e achados imperdíveis de tecnologia, casa e moda.',
    invite_link: 'https://chat.whatsapp.com/DexDPbamt3LHxb1qMZbqZl',
    image_url: null,
    badge: 'Mais popular',
    is_popular: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'g2',
    title: 'Grupo 2 - Cupons Exclusivos',
    description: 'Cupons testados e atualizados a todo momento para grandes lojas online.',
    invite_link: 'https://chat.whatsapp.com/II7RwnGiu5oFyIWbMwnDdA',
    image_url: null,
    badge: 'Vagas limitadas',
    is_popular: false,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'g3',
    title: 'Grupo 3 - Achadinhos do Pedro',
    description: 'Promoções relâmpago e menor preço histórico garimpados diariamente.',
    invite_link: 'https://chat.whatsapp.com/DtTTihP0wNq9YrBQaAVniP',
    image_url: null,
    badge: 'Seleção VIP',
    is_popular: false,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'g4',
    title: 'Grupo 4 - Eletrônicos & Tech',
    description: 'Smartphones, notebooks, fones e gadgets com super descontos.',
    invite_link: 'https://chat.whatsapp.com/CcBPwQ7QNDCHw4l8P2w4bV',
    image_url: null,
    badge: 'Tecnologia',
    is_popular: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'g5',
    title: 'Grupo 5 - Casa & Utilitários',
    description: 'Eletrodomésticos, decoração e itens para o lar com preços especiais.',
    invite_link: 'https://chat.whatsapp.com/K31ICDiu9K35QnfhZHxdps',
    image_url: null,
    badge: 'Casa & Lar',
    is_popular: false,
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'g6',
    title: 'Grupo 6 - Bug de Preço & Relâmpago',
    description: 'Erros de precificação e ofertas ultra rápidas que duram poucos minutos.',
    invite_link: 'https://chat.whatsapp.com/LXHsVJ7jojr81z39KGlsfM',
    image_url: null,
    badge: 'Alerta urgente',
    is_popular: false,
    is_active: true,
    sort_order: 6,
  },
];

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState<Group | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    invite_link: '',
    badge: '',
    is_popular: false,
    is_active: true,
    sort_order: 1,
    image_url: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const supabase = createClient();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        setGroups(defaultGroupsList);
      } else {
        setGroups(data);
      }
    } catch {
      setGroups(defaultGroupsList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormData({
      title: '',
      description: '',
      invite_link: '',
      badge: '',
      is_popular: false,
      is_active: true,
      sort_order: groups.length + 1,
      image_url: '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      title: group.title,
      description: group.description || '',
      invite_link: group.invite_link,
      badge: group.badge || '',
      is_popular: group.is_popular,
      is_active: group.is_active,
      sort_order: group.sort_order,
      image_url: group.image_url || '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `group-${Date.now()}.${fileExt}`;
      const filePath = `groups/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pedro-indica-assets')
        .upload(filePath, file);

      if (uploadError) {
        // Se a storage não estiver configurada no Supabase ainda, converte para base64 data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('pedro-indica-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch {
      setErrorMsg('Falha ao enviar imagem. Verifique se o formato é válido.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    // Validação com Zod
    const validation = GroupSchema.safeParse({
      title: formData.title,
      description: formData.description || null,
      invite_link: formData.invite_link,
      badge: formData.badge || null,
      is_popular: formData.is_popular,
      is_active: formData.is_active,
      sort_order: Number(formData.sort_order),
      image_url: formData.image_url || null,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Preencha os campos corretamente.';
      setErrorMsg(firstError);
      setSaving(false);
      return;
    }

    // Verificar duplicatas no estado local antes de salvar
    const duplicateLink = groups.find(
      (g) => g.invite_link.toLowerCase() === formData.invite_link.toLowerCase() && g.id !== editingGroup?.id
    );

    if (duplicateLink) {
      setErrorMsg('Este link de convite do WhatsApp já está cadastrado em outro grupo!');
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || null,
      invite_link: formData.invite_link,
      badge: formData.badge || null,
      is_popular: formData.is_popular,
      is_active: formData.is_active,
      sort_order: Number(formData.sort_order),
      image_url: formData.image_url || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingGroup) {
        // Atualizar
        const { error } = await supabase
          .from('groups')
          .update(payload)
          .eq('id', editingGroup.id);

        if (error) {
          if (error.code === '23505') {
            setErrorMsg('Este link de convite do WhatsApp já está cadastrado no banco!');
            setSaving(false);
            return;
          }
          // Fallback para estado local
          setGroups((prev) =>
            prev.map((g) => (g.id === editingGroup.id ? { ...g, ...payload } : g))
          );
        } else {
          await supabase.from('audit_logs').insert({
            action: 'UPDATE_GROUP',
            details: { groupId: editingGroup.id, title: payload.title },
          });
        }
        setSuccessMsg(`Grupo "${payload.title}" atualizado com sucesso!`);
      } else {
        // Criar
        const { data: newGroup, error } = await supabase
          .from('groups')
          .insert(payload)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            setErrorMsg('Este link de convite do WhatsApp já está cadastrado!');
            setSaving(false);
            return;
          }
          // Fallback local
          const createdFallback: Group = {
            id: `g-${Date.now()}`,
            ...payload,
          };
          setGroups((prev) => [...prev, createdFallback]);
        } else if (newGroup) {
          await supabase.from('audit_logs').insert({
            action: 'CREATE_GROUP',
            details: { groupId: newGroup.id, title: payload.title },
          });
          setGroups((prev) => [...prev, newGroup]);
        }
        setSuccessMsg(`Novo grupo "${payload.title}" criado com sucesso!`);
      }

      setIsModalOpen(false);
      fetchGroups();
    } catch {
      setErrorMsg('Erro inesperado ao salvar grupo.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleToggleActive = async (group: Group) => {
    const updatedStatus = !group.is_active;
    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, is_active: updatedStatus } : g))
    );

    await supabase
      .from('groups')
      .update({ is_active: updatedStatus, updated_at: new Date().toISOString() })
      .eq('id', group.id);

    setSuccessMsg(`Status do grupo "${group.title}" alterado.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleMoveOrder = async (group: Group, direction: 'up' | 'down') => {
    const sorted = [...groups].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((g) => g.id === group.id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentGroup = sorted[index];
    const targetGroup = sorted[targetIndex];

    const tempOrder = currentGroup.sort_order;
    currentGroup.sort_order = targetGroup.sort_order;
    targetGroup.sort_order = tempOrder;

    setGroups([...sorted]);

    await Promise.all([
      supabase.from('groups').update({ sort_order: currentGroup.sort_order }).eq('id', currentGroup.id),
      supabase.from('groups').update({ sort_order: targetGroup.sort_order }).eq('id', targetGroup.id),
    ]);

    setSuccessMsg('Ordem dos grupos atualizada!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteGroup = async () => {
    if (!deleteConfirmGroup) return;

    setSaving(true);
    try {
      await supabase.from('groups').delete().eq('id', deleteConfirmGroup.id);
      await supabase.from('audit_logs').insert({
        action: 'DELETE_GROUP',
        details: { groupId: deleteConfirmGroup.id, title: deleteConfirmGroup.title },
      });

      setGroups((prev) => prev.filter((g) => g.id !== deleteConfirmGroup.id));
      setSuccessMsg(`Grupo "${deleteConfirmGroup.title}" excluído.`);
      setDeleteConfirmGroup(null);
    } catch {
      setErrorMsg('Erro ao excluir grupo.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Gerenciamento de Grupos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cadastre, edite, reordene e ative/desative os links de WhatsApp públicos da landing page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-950 bg-brand-lime hover:bg-emerald-400 transition-all shadow-neon-lime touch-target"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Grupo</span>
        </button>
      </div>

      {/* Alertas de Sucesso/Erro */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabela/Lista de Grupos */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 glass-card rounded-2xl border border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-cyan mb-3" />
          <p className="text-sm">Carregando grupos de WhatsApp...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="p-12 text-center text-slate-400 glass-card rounded-2xl border border-slate-800">
          <MessageCircle className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-bold text-white mb-1">Nenhum grupo cadastrado</p>
          <p className="text-xs text-slate-400 mb-4">Clique no botão abaixo para adicionar seu primeiro grupo de WhatsApp.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-brand-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Grupo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !group.is_active
                  ? 'opacity-50 bg-slate-950/50 border-slate-900'
                  : group.is_popular
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Informações Principais */}
              <div className="flex items-start gap-4">
                {/* Imagem do Grupo */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                  {group.image_url ? (
                    <Image src={group.image_url} alt={group.title} fill className="object-cover" />
                  ) : (
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      #{index + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{group.title}</h3>
                    {group.is_popular && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        <Star className="w-3 h-3 fill-emerald-300" />
                        Mais popular
                      </span>
                    )}
                    {group.badge && !group.is_popular && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-brand-cyan border border-cyan-500/30">
                        {group.badge}
                      </span>
                    )}
                    {!group.is_active && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">
                        Inativo
                      </span>
                    )}
                  </div>

                  {group.description && (
                    <p className="text-xs text-slate-300 line-clamp-1">{group.description}</p>
                  )}

                  <a
                    href={group.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline font-mono truncate max-w-md pt-1"
                  >
                    <span>{group.invite_link}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Ações e Controles */}
              <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 justify-end">
                {/* Reordenação */}
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleMoveOrder(group, 'up')}
                    disabled={index === 0}
                    title="Mover para cima"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(group, 'down')}
                    disabled={index === groups.length - 1}
                    title="Mover para baixo"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Alternar Ativo/Inativo */}
                <button
                  onClick={() => handleToggleActive(group)}
                  title={group.is_active ? 'Desativar grupo' : 'Ativar grupo'}
                  className={`p-2 rounded-xl border transition-colors ${
                    group.is_active
                      ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:bg-emerald-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  {group.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Editar */}
                <button
                  onClick={() => openEditModal(group)}
                  title="Editar grupo"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-brand-cyan hover:bg-cyan-950/40 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Excluir */}
                <button
                  onClick={() => setDeleteConfirmGroup(group)}
                  title="Excluir grupo"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg glass-card p-6 rounded-2xl border border-slate-800 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingGroup ? 'Editar Grupo de WhatsApp' : 'Novo Grupo de WhatsApp'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveGroup} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título do Grupo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Grupo 1 - Ofertas Diárias"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              {/* Descrição Curta */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Principais cupons de desconto e achados imperdíveis..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
                />
              </div>

              {/* Link de Convite do WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link de Convite do WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.invite_link}
                  onChange={(e) => setFormData({ ...formData, invite_link: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Deve ser uma URL HTTPS válida do chat.whatsapp.com. Não são permitidos links duplicados.
                </p>
              </div>

              {/* Selo/Badge e Imagem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Selo Opcional (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: Vagas limitadas, VIP"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Imagem do Grupo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Imagem / Ícone do Grupo
                </label>
                <div className="flex items-center gap-3">
                  {formData.image_url ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0">
                      <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 cursor-pointer text-xs text-slate-300">
                      <Upload className="w-4 h-4 text-brand-cyan" />
                      <span>{uploadingImage ? 'Enviando...' : 'Carregar Imagem'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Checkboxes: Mais Popular & Ativo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Destaque "Mais popular"</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-cyan focus:ring-brand-cyan"
                  />
                  <span>Grupo Ativo na Landing Page</span>
                </label>
              </div>

              {/* Botões do Form */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-brand-cyan hover:bg-cyan-300 shadow-neon-cyan disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Alterações</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border border-red-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Excluir Grupo?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir o grupo <strong className="text-white">"{deleteConfirmGroup.title}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmGroup(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteGroup}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg disabled:opacity-50"
              >
                {saving ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
