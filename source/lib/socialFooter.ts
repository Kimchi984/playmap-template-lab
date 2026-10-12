import { SOCIAL_CANVAS, SOCIAL_GRAPHIC_SIZES, socialTextAlign, type SocialGraphicScale, type SocialGraphicSlot, type SocialPostSpec, type SocialTextStyle } from "./socialRenderer";

export const CTA_ACCENT_ROLES = ["inline", "accent"] as const;
export const BOTTOM_MOTIF_HEIGHTS: Record<SocialGraphicScale, number> = { small: 180, medium: 260, large: 340 };
export const emptyFooterSlot = (): SocialGraphicSlot => ({ assetId: null, scale: "medium" });
export function splitCtaAccents(spec: Pick<SocialPostSpec, "splitCtaAccents">) {
  return { before: spec.splitCtaAccents?.before ?? emptyFooterSlot(), after: spec.splitCtaAccents?.after ?? emptyFooterSlot() };
}
export function ctaInlineLayout(width: number, before: SocialGraphicSlot | null, after: SocialGraphicSlot | null, style: Pick<SocialTextStyle, "align">, pill = false) {
  const beforeSize = before ? SOCIAL_GRAPHIC_SIZES.inline[before.scale] : 0;
  const afterSize = after ? SOCIAL_GRAPHIC_SIZES.inline[after.scale] : 0;
  const gap = 16;
  const reserved = beforeSize + afterSize + (before ? gap : 0) + (after ? gap : 0) + (pill ? 68 + 36 + 18 : 0);
  return { beforeSize, afterSize, gap, textWidth: Math.max(1, width - reserved), justifyContent: socialTextAlign(style) === "center" ? "center" as const : "flex-start" as const };
}
/** Height preset is an upper bound; exceptionally wide scenes shrink uniformly to fit canvas width. */
export function bottomMotifGeometry(scale: SocialGraphicScale, intrinsicWidth: number, intrinsicHeight: number) {
  if (!Number.isFinite(intrinsicWidth) || !Number.isFinite(intrinsicHeight) || intrinsicWidth <= 0 || intrinsicHeight <= 0) return null;
  const ratio = intrinsicWidth / intrinsicHeight;
  const height = Math.min(BOTTOM_MOTIF_HEIGHTS[scale], SOCIAL_CANVAS.width / ratio);
  const width = height * ratio;
  return { width, height, left: (SOCIAL_CANVAS.width - width) / 2, top: SOCIAL_CANVAS.height - height };
}
