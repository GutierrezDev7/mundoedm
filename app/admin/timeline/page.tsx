"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/data-context";
import { YouTubeSelector } from "@/components/admin/YouTubeSelector";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function TimelineAdmin() {
  const { saveTimelineSelection } = useSiteData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/content/timeline`)
      .then((r) => r.json())
      .then((items: Array<{ id: string }>) => setSelectedIds(items.map((i) => i.id)))
      .catch(() => {});
  }, []);

  return (
    <YouTubeSelector
      title="Timeline"
      description="Selecione os videos que aparecerao na secao Timeline do site. Apenas videos regulares (sem shorts)."
      fetchEndpoint="/api/youtube/videos"
      selectedIds={selectedIds}
      onSave={saveTimelineSelection}
    />
  );
}
