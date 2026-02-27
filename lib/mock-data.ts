import type { SiteData } from "./types";

export const initialData: SiteData = {
  timeline: [
    { id: "tl-1", title: "O Nascimento do EDM", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", publishedAt: "1987-01-01T00:00:00Z" },
    { id: "tl-2", title: "Era Rave", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", publishedAt: "1992-01-01T00:00:00Z" },
    { id: "tl-3", title: "Revolucao Digital", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", publishedAt: "2000-01-01T00:00:00Z" },
  ],

  memories: [
    { id: "mem-1", title: "Tomorrowland 2019", youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
    { id: "mem-2", title: "Ultra Miami", youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
    { id: "mem-3", title: "EDC Las Vegas", youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
    { id: "mem-4", title: "Creamfields UK", youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
  ],

  legends: [
    { id: "leg-1", title: "Daft Punk - A Historia Completa", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "leg-2", title: "Avicii - O Legado Eterno", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "leg-3", title: "Skrillex - Revolucao Dubstep", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ],

  playlist: [
    { id: "pl-1", title: "Future Core Sessions", thumbnailUrl: "https://img.youtube.com/vi/60ItHLz5WEA/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/playlist?list=PLexample1", itemCount: 24 },
    { id: "pl-2", title: "Festival Prime Cuts", thumbnailUrl: "https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/playlist?list=PLexample2", itemCount: 18 },
    { id: "pl-3", title: "Night Drive EDM", thumbnailUrl: "https://img.youtube.com/vi/2Vv-BfVoq4g/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/playlist?list=PLexample3", itemCount: 32 },
  ],

  social: [
    { id: "soc-1", name: "Instagram", href: "https://www.instagram.com/mundoedm", platform: "instagram" },
    { id: "soc-2", name: "TikTok", href: "https://www.tiktok.com/@mundoedm", platform: "tiktok" },
    { id: "soc-3", name: "YouTube", href: "https://www.youtube.com/@mundoedmoficial", platform: "youtube" },
    { id: "soc-4", name: "WhatsApp", href: "https://wa.me/?text=Oi!%20Quero%20fazer%20parte%20do%20Mundo%20EDM.", platform: "whatsapp" },
  ],
};
