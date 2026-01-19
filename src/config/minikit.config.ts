const ROOT_URL = process.env.NEXT_PUBLIC_URL || "https://splitbase.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "SplitBase",
    subtitle: "Split bills with friends instantly",
    description:
      "Split bills, track expenses, and settle up with friends using USDC on Base. Fast, low-cost, and social.",
    screenshotUrls: [`${ROOT_URL}/screenshots/split-screen.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["payments", "finance", "social", "bills", "usdc", "split"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Split bills. Settle instantly.",
    ogTitle: "SplitBase - Split Bills on Base",
    ogDescription:
      "The easiest way to split bills with friends using USDC on Base blockchain.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;

export default minikitConfig;
