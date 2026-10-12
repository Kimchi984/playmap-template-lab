import type { SocialGraphicScale } from './socialRenderer';

/** Frame-based artwork keeps its transparent composition; it is never fitted into a square. */
export const COVER_CORNER_WIDTHS = { small: 360, medium: 540, large: 720 } as const;
export function coverFrameGeometry(placement: 'full-bleed-bottom' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right' | 'full-frame', scale: SocialGraphicScale) {
  const common = { height: 'auto' as const, maxWidth: 'none' as const, display: 'block' };
  if (placement === 'full-bleed-bottom') return { ...common, width: 1080, left: 0, bottom: 0 };
  if (placement === 'full-frame') return { ...common, width: 1080, right: 0, top: 0 };
  return { ...common, width: COVER_CORNER_WIDTHS[scale], ...(placement.endsWith('left') ? {left:0} : {right:0}), ...(placement.startsWith('bottom') ? {bottom:0} : {top:0}) };
}

/** Retain the source lower hero zone for all upload states. Full-width is independent of scale. */
export function coverHeadlineHeight(placement: string, scale: SocialGraphicScale, support: boolean, copySpace: 'image-reserved' | 'expanded' = 'image-reserved') {
  if (copySpace === 'expanded') return 1350 - 84 - 300 - (support ? 140 : 0);
  const reservedHeroHeight = placement === 'full-bleed-bottom' ? 520 : {small:360,medium:440,large:520}[scale];
  return Math.max(260, 1350 - reservedHeroHeight - 40 - 300 - (support ? 140 : 0));
}
