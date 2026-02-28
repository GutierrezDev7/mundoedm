"use client";

const REXIUM_URL = "https://rexium-two.vercel.app/";

export function MadeByRexium() {
  return (
    <div
      className="pointer-events-auto fixed bottom-4 right-4 z-20 select-none sm:bottom-5 sm:right-5"
      aria-label="Site feito por Rexium"
    >
      <p className="text-[10px] font-light tracking-[0.18em] text-white/35 sm:text-[11px]">
        made by{" "}
        <a
          href={REXIUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/45 transition-colors hover:text-white/65"
          title="Rexium — Estúdio de Engenharia Criativa"
        >
          rexium
        </a>
      </p>
    </div>
  );
}
