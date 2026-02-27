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
    { id: "playlist", label: "playlistS" },
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
      duration: 1.5,
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection("hero")}
              className="group flex items-center"
            >
              <img
                src="/LOGO%202.png"
                alt="Logo Mundo EDM branca"
                className="h-10 w-auto transition-transform group-hover:scale-105 md:h-20"
              />
            </button>

            <div className="hidden items-center space-x-8 md:flex">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm uppercase tracking-wider text-gray-400 transition-colors hover:text-yellow-500"
                >
                  {section.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-white md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/98 backdrop-blur-xl md:hidden">
          <div className="flex h-full flex-col items-center justify-center space-y-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-3xl uppercase tracking-wider text-gray-400 transition-colors hover:text-yellow-500"
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
