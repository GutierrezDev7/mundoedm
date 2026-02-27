"use client";

import Link from "next/link";
import { Clock, Film, Crown, Headphones, Share2, Loader2 } from "lucide-react";
import { useSiteData } from "@/lib/data-context";

const sections = [
  { key: "timeline" as const, label: "Timeline", icon: Clock, href: "/admin/timeline", color: "from-yellow-600 to-yellow-800", desc: "CRUD manual" },
  { key: "memories" as const, label: "Memórias", icon: Film, href: "/admin/memories", color: "from-purple-600 to-purple-800", desc: "Shorts do YouTube" },
  { key: "legends" as const, label: "Lendas", icon: Crown, href: "/admin/legends", color: "from-amber-600 to-amber-800", desc: "Videos do YouTube" },
  { key: "playlist" as const, label: "Playlist", icon: Headphones, href: "/admin/playlist", color: "from-green-600 to-green-800", desc: "Playlists do canal" },
  { key: "social" as const, label: "Social", icon: Share2, href: "/admin/social", color: "from-blue-600 to-blue-800", desc: "CRUD manual" },
];

export default function AdminDashboard() {
  const { data, loading } = useSiteData();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-500">Gerencie o conteúdo de todas as seções do Mundo EDM.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-10 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando dados do backend...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const count = data[section.key].length;
            return (
              <Link
                key={section.key}
                href={section.href}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{section.label}</h3>
                <p className="mt-1 text-3xl font-bold text-white">{count}</p>
                <p className="text-sm text-gray-500">
                  {count === 1 ? "item" : "itens"} &middot; {section.desc}
                </p>
                <div className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
