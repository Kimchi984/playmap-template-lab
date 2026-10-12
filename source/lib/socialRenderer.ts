import type { SocialListSpec } from "./socialList";
import type { CuratedPostSpec } from "./socialCurated";
export { displayTypography } from "./socialTypography";
export type SocialRecipe = "big-type-accents" | "split" | "list" | "curated-picks";
export type SocialPaletteKey = "teal" | "blueTeal" | "white" | "warmLight" | "ink" | "muted" | "aqua" | "seafoam" | "sunshine" | "pink" | "lilac" | "orange" | "poolBlue";
export type SocialBackgroundKey = Exclude<SocialPaletteKey, "white" | "ink" | "muted">;
export type SocialTextSize = "small" | "default" | "large";
export type SocialTextNudge = -2 | -1 | 0 | 1 | 2;
export type SocialGraphicScale = "small" | "medium" | "large";
export type PrimaryGraphicLayout = "right-of-copy" | "below-right";
export const PRIMARY_GRAPHIC_LAYOUTS: readonly PrimaryGraphicLayout[] = ["right-of-copy", "below-right"];
/** Library roles map one-to-one onto renderer slot families. */
export type SocialGraphicRole = "hero" | "accent" | "inline" | "bottom_motif";
export const SOCIAL_GRAPHIC_ROLES: readonly SocialGraphicRole[] = ["hero", "accent", "inline", "bottom_motif"];
/** Legacy Phase 1.1 category values, kept readable without rewriting stored rows. */
const LEGACY_CATEGORY_ROLES: Record<string, SocialGraphicRole[]> = { primary: ["hero"], accent: ["accent"], shape: ["accent", "bottom_motif"], icon: ["inline", "accent"] };
export function graphicRoles(asset: Pick<SocialGraphicAsset, "category" | "roles">): SocialGraphicRole[] {
  if (asset.roles?.length) return asset.roles;
  if ((SOCIAL_GRAPHIC_ROLES as readonly string[]).includes(asset.category)) return [asset.category as SocialGraphicRole];
  return LEGACY_CATEGORY_ROLES[asset.category] ?? [];
}
export function compatibleGraphics(assets: SocialGraphicAsset[], role: SocialGraphicRole): SocialGraphicAsset[] {
  return compatibleGraphicsForRoles(assets, [role]);
}
export function compatibleGraphicsForRoles(assets: SocialGraphicAsset[], roles: readonly SocialGraphicRole[]): SocialGraphicAsset[] {
  return assets.filter((asset) => graphicRoles(asset).some((role) => roles.includes(role)));
}

export type SocialPalette = { label: string; value: string; foreground: "white" | "teal" };
export const SOCIAL_PALETTE: Record<SocialPaletteKey, SocialPalette> = {
  teal: { label: "Playmap teal", value: "#0F7C78", foreground: "white" },
  blueTeal: { label: "Deep blue-teal", value: "#156F8A", foreground: "white" },
  white: { label: "White", value: "#FFFFFF", foreground: "teal" },
  warmLight: { label: "Warm light", value: "#F7F8F5", foreground: "teal" },
  ink: { label: "Ink", value: "#22251F", foreground: "teal" },
  muted: { label: "Muted", value: "#626A61", foreground: "teal" },
  aqua: { label: "Soft aqua", value: "#BFEAF2", foreground: "teal" },
  seafoam: { label: "Seafoam mint", value: "#D8F1E6", foreground: "teal" },
  sunshine: { label: "Sunshine", value: "#F4D84A", foreground: "teal" },
  pink: { label: "Play pink", value: "#F59AC2", foreground: "teal" },
  lilac: { label: "Lilac", value: "#A999F5", foreground: "teal" },
  orange: { label: "Orange", value: "#F7A046", foreground: "teal" },
  poolBlue: { label: "Pool blue", value: "#6EC5E9", foreground: "teal" },
};
export const SOCIAL_BACKGROUND_KEYS: readonly SocialBackgroundKey[] = ["teal", "blueTeal", "warmLight", "aqua", "seafoam", "sunshine", "pink", "lilac", "orange", "poolBlue"];

export type SocialTextAlign = "left" | "centre";
export type SocialTextStyle = { colour: SocialPaletteKey | "auto"; size: SocialTextSize; nudge: SocialTextNudge; align?: SocialTextAlign; accentEnding?: "none" | "last-word"; accentColour?: SocialPaletteKey };
export function socialTextAlign(style: Pick<SocialTextStyle, "align">): "left" | "center" { return style.align === "centre" ? "center" : "left"; }
export type SocialTextBlock = { text: string; style: SocialTextStyle };
export type SocialGraphicAsset = { id: string; name: string; url: string; mimeType: string; category: string; tags: string[]; builtIn?: boolean; roles?: SocialGraphicRole[] };
export type SocialGraphicSlot = { assetId: string | null; scale: SocialGraphicScale };
export type PrimaryGraphicSlot = SocialGraphicSlot & { layout: PrimaryGraphicLayout };
export type SocialOverlayKind = "accent" | "hero";
export type SocialGraphicOverlay = SocialGraphicSlot & { id: string; kind: SocialOverlayKind; x: number; y: number };
export const SOCIAL_OVERLAY_LIMIT = 4;
export const SOCIAL_CANVAS = { width: 1080, height: 1350 } as const;
export const SOCIAL_SPLIT_FOOTER_HEIGHT = 140;
export const SOCIAL_SPLIT_PANEL_HEIGHT = (SOCIAL_CANVAS.height - SOCIAL_SPLIT_FOOTER_HEIGHT) / 2;
/** Shared CTA copy and bounded vertical styling; legacy panel lower blocks are not used. */
export function splitFooterLayout(block: SocialTextBlock) {
  return { text: normaliseSocialText(block.text), background: "warmLight" as const,
    width: SOCIAL_CANVAS.width - 84 * 2, maxHeight: 48,
    nudge: Math.max(-36, Math.min(36, TEXT_NUDGE_PX[block.style.nudge])) };
}
export type SplitPanelSpec = { background: SocialBackgroundKey; headline: SocialTextBlock; supporting: SocialTextBlock; lower: SocialTextBlock; graphic: SocialGraphicSlot };
export type SocialPostSpec = {
  recipe: SocialRecipe;
  /** Design-level brand setting; missing resolves to "default". */
  wordmark?: SocialWordmarkSetting;
  background: SocialBackgroundKey;
  headline: SocialTextBlock;
  supporting: SocialTextBlock;
  lower: SocialTextBlock;
  splitCtaAccents?: { before: SocialGraphicSlot; after: SocialGraphicSlot };
  overlays?: SocialGraphicOverlay[];
  /** Legacy input compatibility only; never participates in Big Type text layout. */
  primaryGraphic?: PrimaryGraphicSlot;
  headlineAccent1?: SocialGraphicSlot;
  headlineAccent2?: SocialGraphicSlot;
  supportIconBefore?: SocialGraphicSlot;
  supportIconAfter?: SocialGraphicSlot;
  bottomMotif?: SocialGraphicSlot;
  topPanel: SplitPanelSpec;
  bottomPanel: SplitPanelSpec;
  /** List Template v1 state; optional so older Big Type/Split specs stay valid. */
  list?: SocialListSpec;
  /** Curated Picks carousel: ordered slides[]; optional so single-slide specs stay valid. */
  curated?: CuratedPostSpec;
};

export const SOCIAL_SAMPLES = ["Go play.", "Three brilliant playgrounds for warm afternoons", "Family adventures worth crossing Melbourne for this school holiday break"] as const;
export const BUILT_IN_SOCIAL_GRAPHICS: SocialGraphicAsset[] = [{ id: "builtin-slide", name: "Playground slide", url: "/slide-icon.svg", mimeType: "image/svg+xml", category: "icon", tags: ["playground", "play"], builtIn: true, roles: ["hero", "accent", "inline"] }];
export const TEXT_SIZE_MULTIPLIER: Record<SocialTextSize, number> = { small: 0.88, default: 1, large: 1.12 };
/** Display-only art direction; supporting and CTA text retain their quieter size mapping. */
export const DISPLAY_SIZE_MULTIPLIER: Record<SocialTextSize, number> = { small: 0.9, default: 1, large: 1.22 };
export const DISPLAY_CEILINGS = { bigType: 210, split: 130, list: 112, editorial: 190, pick: 112 } as const;
export const TEXT_NUDGE_PX: Record<SocialTextNudge, number> = { [-2]: -56, [-1]: -28, 0: 0, 1: 28, 2: 56 };
export const GRAPHIC_SCALE_MULTIPLIER: Record<SocialGraphicScale, number> = { small: 0.72, medium: 1, large: 1.24 };
/** Native artwork pixels, never multiplied by text size or flex-shrunk. */
export const SOCIAL_GRAPHIC_SIZES = {
  bigHero: { small: 320, medium: 400, large: 480 },
  splitHero: { small: 240, medium: 310, large: 380 },
  accent: { small: 90, medium: 135, large: 180 },
  inline: { small: 44, medium: 60, large: 76 },
  bottomMotif: { small: 190, medium: 280, large: 360 },
} as const satisfies Record<string, Record<SocialGraphicScale, number>>;

export function overlaySize(overlay: Pick<SocialGraphicOverlay, "kind" | "scale">): number {
  return SOCIAL_GRAPHIC_SIZES[overlay.kind === "hero" ? "bigHero" : "accent"][overlay.scale];
}
export function clampOverlay(overlay: SocialGraphicOverlay): SocialGraphicOverlay {
  const size = overlaySize(overlay);
  const clamp = (value: number, max: number) => Math.round(Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0)));
  return { ...overlay, x: clamp(overlay.x, SOCIAL_CANVAS.width - size), y: clamp(overlay.y, SOCIAL_CANVAS.height - size) };
}
export function createOverlay(id: string, kind: SocialOverlayKind, existing: readonly SocialGraphicOverlay[]): SocialGraphicOverlay | null {
  if (existing.length >= SOCIAL_OVERLAY_LIMIT) return null;
  const accentIndex = existing.filter((item) => item.kind === "accent").length;
  return clampOverlay({ id, assetId: null, kind, scale: "medium", x: kind === "hero" ? 600 : 840, y: kind === "hero" ? 740 : accentIndex === 0 ? 238 : 740 });
}
/** Explicit overlays (including []) win. Legacy hero/accents get fixed starting positions;
 * obsolete inline/motif slots are intentionally not carried into this layer. */
export function bigTypeOverlays(spec: SocialPostSpec): SocialGraphicOverlay[] {
  if (spec.overlays) return spec.overlays.slice(0, SOCIAL_OVERLAY_LIMIT).map(clampOverlay);
  const overlays: SocialGraphicOverlay[] = [];
  for (const [key, kind] of [["headlineAccent1", "accent"], ["headlineAccent2", "accent"], ["primaryGraphic", "hero"]] as const) {
    const slot = spec[key];
    if (!slot?.assetId) continue;
    const overlay = createOverlay(`legacy-${key}`, kind, overlays);
    if (overlay) overlays.push(clampOverlay({ ...overlay, assetId: slot.assetId, scale: slot.scale }));
  }
  return overlays;
}
/** Full established text region, independent of every graphic field. */
export function bigTypeTextLayout(spec: SocialPostSpec) {
  return { left: 88, right: 80, top: 238, bottom: 200, copyWidth: 912, supportWidth: 912,
    headlineMaxHeight: 1350 - 238 - 200 - (normaliseSocialText(spec.supporting.text) ? 160 : 0) - 56,
    headlineMaxSize: DISPLAY_CEILINGS.bigType * DISPLAY_SIZE_MULTIPLIER[spec.headline.style.size] };
}
export const defaultTextStyle = (): SocialTextStyle => ({ colour: "auto", size: "default", nudge: 0, align: "left" });
export function defaultTextColour(background: SocialPaletteKey): string { return SOCIAL_PALETTE[background].foreground === "white" ? "#FFFFFF" : "#0F7C78"; }
export function textColour(style: SocialTextStyle, background: SocialPaletteKey): string { return style.colour === "auto" ? defaultTextColour(background) : SOCIAL_PALETTE[style.colour].value; }
export function normaliseSocialText(value: string, fallback = ""): string { const normalised = value.trim().replace(/[^\S\n]+/g, " "); return normalised || fallback; }
export type SocialWordmarkSetting = "default" | "show" | "hide";
/** Brand Kit preference for "default"; the Playmap prototype shows the wordmark. */
export const PLAYMAP_WORDMARK_DEFAULT_VISIBLE = true;
export function resolveWordmarkVisible(spec: Pick<SocialPostSpec, "wordmark">, brandDefault = PLAYMAP_WORDMARK_DEFAULT_VISIBLE): boolean {
  const setting = spec.wordmark ?? "default";
  return setting === "default" ? brandDefault : setting === "show";
}
/** Fit-box scaling for size presets: measure at width/m and maxHeight/m, then scale the font by m.
 * The scaled text fills the same box, so Small/Large always differ visibly even when the box limits fit. */
export function headlineFitBox(width: number, maxHeight: number, maxSize: number, size: SocialTextSize, display = false) {
  const m = display ? DISPLAY_SIZE_MULTIPLIER[size] : TEXT_SIZE_MULTIPLIER[size];
  return { multiplier: m, width: width / m, maxHeight: maxHeight / m, maxSize: maxSize / m };
}

