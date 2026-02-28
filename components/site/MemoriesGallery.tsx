"use client";

import { ExternalLink, Play } from "lucide-react";
import { useSiteData } from "@/lib/data-context";
import type { MemoryItem } from "@/lib/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

function ShortCard({ item }: { item: MemoryItem }) {
  return (
    <a
      href={item.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <div className="relative aspect-[9/16] w-[42vw] min-w-[130px] max-w-[192px] overflow-hidden rounded-2xl border border-yellow-900/20 bg-gray-900 transition-all duration-500 hover:border-yellow-600/50 sm:w-40 sm:min-w-0 sm:max-w-none md:w-44 lg:w-48">
        <img
          src={item.thumbnailUrl}
          alt={item.title ?? ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/20 backdrop-blur-md">
              <Play className="ml-1 h-7 w-7 text-yellow-500" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex items-center gap-1 p-3">
          <h3 className="line-clamp-2 flex-1 text-sm font-bold text-white">{item.title}</h3>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/40" />
        </div>
      </div>
    </a>
  );
}

export function MemoriesGallery() {
  const { data } = useSiteData();

  return (
    <section id="memories" className="relative overflow-hidden bg-transparent py-20 md:py-28 lg:py-32">
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/5 to-transparent" />
      

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
        <div className="cin-entry mb-10 text-center sm:mb-12">
          <h2 className="mb-3 text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              MEMÓRIAS
            </span>
          </h2>
          <p className="text-sm text-gray-500 sm:text-base md:text-lg">Momentos inesquecíveis em formato curto</p>
        </div>
      </div>

      <HorizontalCarousel className="relative z-10">
        {data.memories.map((item) => (
          <div key={item.id} className="shrink-0">
            <ShortCard item={item} />
          </div>
        ))}
      </HorizontalCarousel>
    </section>
  );
}
