import { useEffect, useState } from "react";
import gsap from "gsap";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(".loading-screen", {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => setIsLoading(false),
        });
      },
    });

    tl.from(".loading-logo", {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: "back.out(1.7)",
    })
      .to(".loading-text", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
      })
      .to(".loading-bar", {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.inOut",
      });

    return () => {
      window.clearTimeout(fallbackTimer);
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
     

      <div className="loading-logo relative z-10 mb-8">
        <div className="relative">
          <img
            src="/LOGO%202.png"
            alt="Logo Mundo EDM branca"
            className="h-24 w-auto md:h-45"
          />
          <div className="absolute inset-0 animate-ping">
            <img
              src="/LOGO%202.png"
              alt=""
              className="h-24 w-auto opacity-40 md:h-28"
            />
          </div>
        </div>
      </div>

      

      <div className="relative z-10 h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <div className="loading-bar h-full origin-left scale-x-0 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700" />
      </div>
    </div>
  );
}
