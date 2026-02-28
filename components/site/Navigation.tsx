import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function Navigation() {
  const sections = [
    { id: "hero", label: "início" },
    { id: "timeline", label: "timeline" },
    { id: "memories", label: "memórias" },
    { id: "legends", label: "lendas" },
    { id: "playlist", label: "playlist" },
    { id: "social", label: "social" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    gsap.to(window, {
      scrollTo: { y: element, offsetY: 0 },
      duration: 0.3,
      ease: "power3.inOut",
    });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-40 transition-all duration-500 ${
          isScrolled
            ? " bg-transparent backdrop-blur-[3px]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex min-h-[44px] min-w-[44px] items-center sm:min-w-0"
          >
            <img
              src="/LOGO%202.png"
              alt="Logo Mundo EDM"
              width={120}
              height={48}
              decoding="async"
              className="h-8 w-auto max-h-12 transition-transform hover:scale-105 sm:h-9 md:h-12 lg:h-16 xl:h-20"
            />
          </button>

          <div className="hidden items-center gap-5 md:flex lg:gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="min-h-[44px] min-w-[44px] text-xs uppercase tracking-wider text-gray-400 transition-colors hover:text-yellow-500 lg:min-w-0 lg:text-sm"
              >
                {section.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-white md:hidden"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/98 backdrop-blur-xl md:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-6 sm:gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="min-h-[48px] w-full max-w-xs py-3 text-center text-2xl uppercase tracking-wider text-gray-400 transition-colors hover:text-yellow-500 sm:min-h-[52px] sm:text-3xl"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
