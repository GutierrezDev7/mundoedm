"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  SiteData,
  SocialLink,
} from "./types";
import { initialData } from "./mock-data";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface DataContextValue {
  data: SiteData;
  loading: boolean;
  backendOnline: boolean;
  refresh: () => Promise<void>;

  saveTimelineSelection: (videoIds: string[]) => Promise<void>;
  saveLegendsSelection: (videoIds: string[]) => Promise<void>;
  saveMemoriesSelection: (videoIds: string[]) => Promise<void>;
  savePlaylistSelection: (playlistIds: string[]) => Promise<void>;

  addSocialLink: (item: Omit<SocialLink, "id">) => Promise<void>;
  updateSocialLink: (id: string, patch: Partial<SocialLink>) => Promise<void>;
  removeSocialLink: (id: string) => Promise<void>;
}

const DataCtx = createContext<DataContextValue | null>(null);

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(() => structuredClone(initialData));
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const health = await fetch(`${API}/api/health`);
      if (!health.ok) throw new Error("offline");
      setBackendOnline(true);

      const [timeline, legends, memories, playlist, social] = await Promise.all([
        safeFetch<SiteData["timeline"]>(`${API}/api/content/timeline`, initialData.timeline),
        safeFetch<SiteData["legends"]>(`${API}/api/content/legends`, initialData.legends),
        safeFetch<SiteData["memories"]>(`${API}/api/content/memories`, initialData.memories),
        safeFetch<SiteData["playlist"]>(`${API}/api/content/playlists`, initialData.playlist),
        safeFetch<SiteData["social"]>(`${API}/api/content/social`, initialData.social),
      ]);
      setData({ timeline, legends, memories, playlist, social });
    } catch {
      setBackendOnline(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Selection savers (Timeline, Legends, Memories) ──

  const saveTimelineSelection = useCallback(async (videoIds: string[]) => {
    await fetch(`${API}/api/content/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIds }),
    });
    await fetchAll();
  }, [fetchAll]);

  const saveLegendsSelection = useCallback(async (videoIds: string[]) => {
    await fetch(`${API}/api/content/legends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIds }),
    });
    await fetchAll();
  }, [fetchAll]);

  const saveMemoriesSelection = useCallback(async (videoIds: string[]) => {
    await fetch(`${API}/api/content/memories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIds }),
    });
    await fetchAll();
  }, [fetchAll]);

  const savePlaylistSelection = useCallback(async (playlistIds: string[]) => {
    await fetch(`${API}/api/content/playlists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIds: playlistIds }),
    });
    await fetchAll();
  }, [fetchAll]);

  // ── Social CRUD ──

  const addSocialLink = useCallback(async (item: Omit<SocialLink, "id">) => {
    const res = await fetch(`${API}/api/content/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const created = (await res.json()) as SocialLink;
      setData((prev) => ({ ...prev, social: [...prev.social, created] }));
    }
  }, []);

  const updateSocialLink = useCallback(async (id: string, patch: Partial<SocialLink>) => {
    const res = await fetch(`${API}/api/content/social/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = (await res.json()) as SocialLink;
      setData((prev) => ({
        ...prev,
        social: prev.social.map((s) => (s.id === id ? updated : s)),
      }));
    }
  }, []);

  const removeSocialLink = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/content/social/${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        social: prev.social.filter((s) => s.id !== id),
      }));
    }
  }, []);

  return (
    <DataCtx.Provider
      value={{
        data,
        loading,
        backendOnline,
        refresh: fetchAll,
        saveTimelineSelection,
        saveLegendsSelection,
        saveMemoriesSelection,
        savePlaylistSelection,
        addSocialLink,
        updateSocialLink,
        removeSocialLink,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useSiteData must be used within DataProvider");
  return ctx;
}
