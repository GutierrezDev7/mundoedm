"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Save, Loader2, CheckSquare, Square } from "lucide-react";

interface YouTubeItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  publishedAt?: string;
  itemCount?: number;
}

interface YouTubeSelectorProps {
  title: string;
  description: string;
  fetchEndpoint: string;
  selectedIds: string[];
  onSave: (ids: string[]) => Promise<void>;
  itemLabel?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function YouTubeSelector({
  title,
  description,
  fetchEndpoint,
  selectedIds,
  onSave,
  itemLabel = "videos",
}: YouTubeSelectorProps) {
  const [items, setItems] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(new Set(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API}${fetchEndpoint}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Erro desconhecido" }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<YouTubeItem[]>;
      })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchEndpoint]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => {
    setSelected(new Set(filtered.map((i) => i.id)));
  };

  const deselectAll = () => {
    setSelected(new Set());
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(Array.from(selected));
    setSaving(false);
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const hasChanges =
    selected.size !== selectedIds.length ||
    Array.from(selected).some((id) => !selectedIds.includes(id));

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-gray-500">{description}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-yellow-500 disabled:opacity-40"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar selecao ({selected.size})
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-400">
            {error.includes("403") || error.toLowerCase().includes("quota")
              ? "Cota da API do YouTube excedida"
              : "Erro ao carregar videos do YouTube"}
          </p>
          <p className="mt-1 text-xs text-red-400/60">
            {error.includes("403") || error.toLowerCase().includes("quota")
              ? "A cota diaria da YouTube Data API foi atingida (10.000 unidades/dia). Ela reseta automaticamente a meia-noite (horario do Pacifico). Os dados em cache continuam funcionando normalmente."
              : "Verifique se o backend esta rodando e se a YOUTUBE_API_KEY esta configurada."}
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch(`${API}${fetchEndpoint}`)
                .then(async (res) => {
                  if (!res.ok) {
                    const body = await res.json().catch(() => ({ error: "Erro desconhecido" }));
                    throw new Error(body.error ?? `HTTP ${res.status}`);
                  }
                  return res.json() as Promise<YouTubeItem[]>;
                })
                .then(setItems)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
            className="mt-3 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por titulo..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pr-3 pl-10 text-sm text-white outline-none focus:border-yellow-500/50"
          />
        </div>
        <button
          onClick={selectAll}
          className="rounded-lg border border-white/10 px-3 py-2.5 text-xs text-gray-400 hover:bg-white/5"
        >
          Selecionar todos
        </button>
        <button
          onClick={deselectAll}
          className="rounded-lg border border-white/10 px-3 py-2.5 text-xs text-gray-400 hover:bg-white/5"
        >
          Limpar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          <p className="mt-3 text-sm text-gray-500">Carregando {itemLabel} do YouTube...</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-xs text-gray-500">
            {filtered.length} {itemLabel} encontrados &middot; {selected.size} selecionados
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-white/10 bg-white/2 hover:border-white/20"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {isSelected ? (
                        <CheckSquare className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
                      ) : (
                        <Square className="h-6 w-6 text-white/40 drop-shadow-lg group-hover:text-white/80" />
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.itemCount !== undefined
                        ? `${item.itemCount} ${item.itemCount === 1 ? "video" : "videos"}`
                        : item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString("pt-BR")
                          : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
