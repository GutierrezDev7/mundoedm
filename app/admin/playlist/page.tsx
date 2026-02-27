"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/data-context";
import { YouTubeSelector } from "@/components/admin/YouTubeSelector";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function PlaylistAdmin() {
  const { savePlaylistSelection } = useSiteData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/content/playlists`)
      .then((r) => r.json())
      .then((items: Array<{ id: string }>) => setSelectedIds(items.map((i) => i.id)))
      .catch(() => {});
  }, []);

  return (
    <YouTubeSelector
      title="Playlists"
      description="Selecione as playlists do canal que aparecerao na secao Playlist do site."
      fetchEndpoint="/api/youtube/playlists"
      selectedIds={selectedIds}
      onSave={savePlaylistSelection}
      itemLabel="playlists"
    />
  );
}
