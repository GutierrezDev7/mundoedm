"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/data-context";
import { YouTubeSelector } from "@/components/admin/YouTubeSelector";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function MemoriesAdmin() {
  const { saveMemoriesSelection } = useSiteData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/content/memories`)
      .then((r) => r.json())
      .then((items: Array<{ id: string }>) => setSelectedIds(items.map((i) => i.id)))
      .catch(() => {});
  }, []);

  return (
    <YouTubeSelector
      title="Memorias"
      description="Selecione os shorts que aparecerao na secao Memorias do site."
      fetchEndpoint="/api/youtube/shorts"
      selectedIds={selectedIds}
      onSave={saveMemoriesSelection}
    />
  );
}
