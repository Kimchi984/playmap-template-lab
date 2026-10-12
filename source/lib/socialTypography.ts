import type { SocialTextSize } from "./socialRenderer";

/** Renderer roles only: product UI and the separate wordmark never consume display. */
export type SocialTypographyRole = "display" | "support";
export const SOCIAL_FONT_NAMES = { display: "Gabarito Variable", support: "DM Sans Variable" } as const;
export const SOCIAL_FONT_FAMILIES = {
  display: '"Gabarito Variable", "Gabarito", ui-sans-serif, system-ui, sans-serif',
  support: '"DM Sans Variable", "DM Sans", ui-sans-serif, system-ui, sans-serif',
} as const;

let selectedDisplayFont: 'gabarito' | 'dm-sans' = 'gabarito';
export function setLabDisplayFont(font: 'gabarito' | 'dm-sans') { selectedDisplayFont = font; }
export function displayTypography(size: SocialTextSize) {
  return {
    fontFamily: selectedDisplayFont === "gabarito" ? SOCIAL_FONT_FAMILIES.display : SOCIAL_FONT_FAMILIES.support,
    fontWeight: size === "small" ? 800 : 900,
    letterSpacing: "-0.04em",
    lineHeight: size === "small" ? 0.90 : 0.86,
  } as const;
}

/** The same object drives visible copy and hidden fitting, including support fits. */
export function socialTypography(role: SocialTypographyRole, size: SocialTextSize = "default", supportWeight = 700, supportLineHeight = 1.15) {
  return role === "display" ? displayTypography(size) : {
    fontFamily: SOCIAL_FONT_FAMILIES.support,
    fontWeight: supportWeight,
    letterSpacing: "0",
    lineHeight: supportLineHeight,
  };
}

/** Explicitly request the real face before ready: ready alone may precede first use. */
export async function waitForSocialFont(fonts: Pick<FontFaceSet, "load" | "ready">, role: SocialTypographyRole, weight: number, text: string) {
  await fonts.load(`${weight} 32px "${role === "display" && selectedDisplayFont === "dm-sans" ? SOCIAL_FONT_NAMES.support : SOCIAL_FONT_NAMES[role]}"`, text || "Playmap");
  await fonts.ready;
}
