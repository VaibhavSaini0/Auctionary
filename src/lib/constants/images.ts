/** Local fallback — always available, no remote fetch required */
export const PLACEHOLDER_IMAGE = "/placeholder.png";

/** Reliable remote placeholders (picsum.photos) for marketing sections */
export const PICSUM = {
  ceramics: "https://picsum.photos/seed/auction-ceramics/520/320",
  coins: "https://picsum.photos/seed/auction-coins/520/320",
  furniture: "https://picsum.photos/seed/auction-furniture/520/320",
  instruments: "https://picsum.photos/seed/auction-instruments/520/320",
  jewelry: "https://picsum.photos/seed/auction-jewelry/520/320",
  aboutHero: "https://picsum.photos/seed/auction-about-hero/800/1000",
  aboutWorkspace: "https://picsum.photos/seed/auction-workspace/800/450",
  aboutShowroom: "https://picsum.photos/seed/auction-showroom/800/600",
  aboutTeam: "https://picsum.photos/seed/auction-team/150/150",
  featuredSculpture: "https://picsum.photos/seed/auction-sculpture/420/420",
  blogFallback: "https://picsum.photos/seed/auction-blog/800/600",
  insight1: "https://picsum.photos/seed/auction-insight-1/800/600",
  insight2: "https://picsum.photos/seed/auction-insight-2/800/600",
} as const;
