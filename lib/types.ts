export interface TimelineItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  publishedAt?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  publishedAt?: string;
}

export interface LegendItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  publishedAt?: string;
}

export interface PlaylistItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  itemCount: number;
}

export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "whatsapp";

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  platform: SocialPlatform;
}

export type SectionKey = "timeline" | "memories" | "legends" | "playlist" | "social";

export interface SiteData {
  timeline: TimelineItem[];
  memories: MemoryItem[];
  legends: LegendItem[];
  playlist: PlaylistItem[];
  social: SocialLink[];
}
