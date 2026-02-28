"use client";

import { Play } from "lucide-react";
import { useSiteData } from "@/lib/data-context";
import type { TimelineItem } from "@/lib/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function TimelineCard({ item }: { item: TimelineItem }) {
  const date = formatDate(item.publishedAt);

  return (
    <a
      href={item.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group relative block"
    >
      <div className="relative overflow-hidden rounded-2xl border border-yellow-900/30 bg-linear-to-br from-gray-900 to-black transition-all duration-500 hover:border-yellow-700/50">
        <div className="relative aspect-video bg-black">
          <img
            src={item.thumbnailUrl}
            alt={item.title ?? ""}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-all duration-300 group-hover:bg-black/30">
            <div className="relative h-24 w-24 shrink-0">
              <div className="absolute inset-0 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/20 backdrop-blur-md transition-transform group-hover:scale-110 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Play className="ml-1 h-10 w-10 text-yellow-500" fill="currentColor" />
              </div>
              <div className="absolute inset-0 h-20 w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/30 blur-xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-b from-gray-900/50 to-black p-5">
          {date && (
            <div className="mb-3 inline-flex items-center rounded-full border border-yellow-700/50 bg-linear-to-r from-yellow-900/50 to-yellow-800/50 px-3 py-1.5">
              <span className="text-sm font-bold text-yellow-500">{date}</span>
            </div>
          )}
          <h3 className="line-clamp-2 text-base font-bold text-white sm:text-lg md:text-xl">{item.title}</h3>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-yellow-500/0 to-yellow-500/0 transition-all duration-500 group-hover:from-yellow-500/10 group-hover:to-yellow-600/5" />
      </div>

      <div className="absolute -bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-linear-to-br from-yellow-600 to-yellow-800 shadow-lg shadow-yellow-500/50" />
        <div className="h-10 w-px bg-linear-to-b from-yellow-700/50 to-transparent" />
      </div>
    </a>
  );
}

export function TimelineSection() {
  const { data } = useSiteData();

  return (
    <section id="timeline" className="relative overflow-hidden bg-transparent py-14 md:py-16">
      <div className="parallax-bg absolute inset-0 bg-linear-to-b from-transparent via-yellow-950/10 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 h-px w-full bg-linear-to-r from-transparent via-yellow-700/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto mb-6 max-w-[1400px] px-4 sm:mb-8 sm:px-6 md:px-12">
        <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="bg-linear-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            TIMELINE
          </span>
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm md:text-base">
          Navegue pelos momentos com as setas ou arraste lateralmente
        </p>
      </div>

      <HorizontalCarousel className="relative z-10 min-h-[52vh] items-center">
        {data.timeline.map((item) => (
          <div key={item.id} className="w-[85vw] max-w-[540px] shrink-0 snap-start sm:w-[82vw]">
            <TimelineCard item={item} />
          </div>
        ))}
      </HorizontalCarousel>
    </section>
  );
}
