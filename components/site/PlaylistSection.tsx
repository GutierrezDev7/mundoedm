"use client";

import { ExternalLink, Headphones, Music, Play, PlayCircle } from "lucide-react";
import { useSiteData } from "@/lib/data-context";
import type { PlaylistItem } from "@/lib/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

function PlaylistCard({ playlist }: { playlist: PlaylistItem }) {
  return (
    <a
      href={playlist.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group block w-64 shrink-0 overflow-hidden rounded-2xl border border-yellow-800/30 bg-black/50 transition-colors duration-300 hover:border-yellow-600/60 sm:w-72"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={playlist.thumbnailUrl}
          alt={playlist.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/20 backdrop-blur-md">
            <Play className="ml-0.5 h-7 w-7 text-yellow-500" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-white">{playlist.title}</h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-yellow-600">
          <Music className="h-3.5 w-3.5" />
          {playlist.itemCount} {playlist.itemCount === 1 ? "video" : "videos"}
        </div>
      </div>
    </a>
  );
}

export function PlaylistSection() {
  const { data } = useSiteData();

  return (
    <section id="playlist" className="relative overflow-hidden bg-transparent py-24 md:py-28">
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="cin-entry mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-700/40 bg-yellow-900/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-500">
            <Headphones className="h-4 w-4" />
            Playlists
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">Playlist Mundo EDM</h2>
          <p className="max-w-2xl text-gray-400 md:text-lg">
            Playlists direto do canal Mundo EDM no YouTube.
          </p>
        </div>
      </div>

      <HorizontalCarousel className="relative z-10">
        {data.playlist.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </HorizontalCarousel>

      <div className="cin-entry relative z-10 mt-10 flex justify-center">
        <a
          href="https://www.youtube.com/@mundoedmoficial/playlists"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-yellow-600/40 bg-yellow-500/10 px-6 py-3 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/20"
        >
          <PlayCircle className="h-4 w-4" />
          Ver playlists do canal
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
