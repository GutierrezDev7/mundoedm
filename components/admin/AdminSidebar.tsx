"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clock, Film, Crown, Headphones, Share2, LayoutDashboard, LogOut } from "lucide-react";
import { clearAdminToken } from "@/lib/auth-admin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/timeline", label: "Timeline", icon: Clock },
  { href: "/admin/memories", label: "Memórias", icon: Film },
  { href: "/admin/legends", label: "Lendas", icon: Crown },
  { href: "/admin/playlist", label: "Playlist", icon: Headphones },
  { href: "/admin/social", label: "Social", icon: Share2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700" />
        <div>
          <p className="text-sm font-bold text-white">Mundo EDM</p>
          <p className="text-[10px] uppercase tracking-widest text-yellow-600">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 transition-colors hover:text-white"
        >
          &larr; Voltar ao site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 transition-colors hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
