/**
 * AI QR Code Placeholder Service
 *
 * Applies canvas-based artistic effects to QR codes.
 * This is a placeholder that will be replaced with Stable Diffusion/ControlNet later.
 */

export type AIStyle =
  | "galaxy"
  | "ocean"
  | "forest"
  | "sunset"
  | "neon"
  | "watercolor"
  | "cyberpunk"
  | "minimal"
  | "gradient"
  | "marble";

export interface AIStyleConfig {
  name: AIStyle;
  label: string;
  description: string;
  colors: [string, string, string];
  overlay: "gradient" | "radial" | "pattern";
}

export const AI_STYLES: AIStyleConfig[] = [
  {
    name: "galaxy",
    label: "Galaxy",
    description: "Deep space with cosmic colors",
    colors: ["#0f0c29", "#302b63", "#24243e"],
    overlay: "radial",
  },
  {
    name: "ocean",
    label: "Ocean",
    description: "Deep blue ocean waves",
    colors: ["#006994", "#00b4d8", "#90e0ef"],
    overlay: "gradient",
  },
  {
    name: "forest",
    label: "Forest",
    description: "Natural green tones",
    colors: ["#1b4332", "#2d6a4f", "#52b788"],
    overlay: "gradient",
  },
  {
    name: "sunset",
    label: "Sunset",
    description: "Warm sunset gradients",
    colors: ["#f72585", "#b5179e", "#7209b7"],
    overlay: "radial",
  },
  {
    name: "neon",
    label: "Neon",
    description: "Vibrant neon glow",
    colors: ["#00f5d4", "#00bbf9", "#f15bb5"],
    overlay: "gradient",
  },
  {
    name: "watercolor",
    label: "Watercolor",
    description: "Soft watercolor wash",
    colors: ["#fec89a", "#ffd7ba", "#fec5bb"],
    overlay: "radial",
  },
  {
    name: "cyberpunk",
    label: "Cyberpunk",
    description: "Dark with electric accents",
    colors: ["#0d1117", "#ff006e", "#3a86ff"],
    overlay: "pattern",
  },
  {
    name: "minimal",
    label: "Minimal",
    description: "Clean minimal design",
    colors: ["#264653", "#2a9d8f", "#e9c46a"],
    overlay: "gradient",
  },
  {
    name: "gradient",
    label: "Gradient",
    description: "Smooth color gradient",
    colors: ["#667eea", "#764ba2", "#f093fb"],
    overlay: "gradient",
  },
  {
    name: "marble",
    label: "Marble",
    description: "Elegant marble texture",
    colors: ["#c9c9c9", "#e8e8e8", "#f5f5f5"],
    overlay: "pattern",
  },
];

export function getAIStyleConfig(styleName: string): AIStyleConfig | undefined {
  return AI_STYLES.find((s) => s.name === styleName);
}
