"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/data-context";
import { YouTubeSelector } from "@/components/admin/YouTubeSelector";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function LegendsAdmin() {
  const { saveLegendsSelection } = useSiteData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/content/legends`)
      .then((r) => r.json())
      .then((items: Array<{ id: string }>) => setSelectedIds(items.map((i) => i.id)))
      .catch(() => {});
  }, []);

  return (
    <YouTubeSelector
      title="Lendas"
      description="Selecione os vídeos de histórias que aparecerão na seção Lendas do site."
      fetchEndpoint="/api/youtube/videos"
      selectedIds={selectedIds}
      onSave={saveLegendsSelection}
    />
  );
}
