import { clampOverlay, defaultTextStyle, SOCIAL_OVERLAY_LIMIT, type SocialBackgroundKey, type SocialGraphicOverlay, type SocialGraphicScale, type SocialPostSpec, type SocialTextBlock, type SocialWordmarkSetting } from "./socialRenderer";
import { defaultListSpec, type SocialListSpec } from "./socialList";

/** Post = parent; slides[] is heterogeneous and each slide names its own template.
 * Editorial Cover replaces the retired Curated-only cover (see migratePostSlide). */
export type EditorialCoverHeroPlacement = "bottom-right" | "bottom" | "full-bleed-bottom";
export const EDITORIAL_COVER_HERO_PLACEMENTS: readonly EditorialCoverHeroPlacement[] = ["bottom-right", "bottom", "full-bleed-bottom"];
export type EditorialCoverSlideSpec = {
  template: "editorial-cover"; id: string; background: SocialBackgroundKey;
  kicker: SocialTextBlock; headline: SocialTextBlock; supporting: SocialTextBlock;
  /** Structural, template-owned hero; never freeform. */
  hero: { assetId: string | null; scale: SocialGraphicScale; placement: EditorialCoverHeroPlacement };
  copySpace?: 'image-reserved' | 'expanded';
  /** Freeform decorative accents only (kind "accent"), max SOCIAL_OVERLAY_LIMIT. */
  accents: SocialGraphicOverlay[];
  /** Optional additional artwork; placement is independent of the asset’s subject. */
  corner?: { assetId: string | null; scale: SocialGraphicScale; placement: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "full-frame" };
};
/** Retired shape, read only by the migration adapter. */
export type LegacyCuratedCoverSlide = {
  template: "curated-cover"; id: string; background: SocialBackgroundKey;
  headline: SocialTextBlock; supporting: SocialTextBlock; count?: string;
  hero?: { assetId: string | null; scale: SocialGraphicScale; placement?: string }; accents?: SocialGraphicOverlay[];
};
/** Existing List composition hosted as a slide. */
export type ListSlideSpec = { template: "list"; id: string; list: SocialListSpec };
export type CuratedVisualMode = "photo" | "graphic";
export type CuratedPhotoFocus = "top" | "center" | "bottom";
export type CuratedGraphicPlacement = "bleed-right" | "bleed-top-right" | "bleed-bottom-right";
export const CURATED_GRAPHIC_PLACEMENTS: readonly CuratedGraphicPlacement[] = ["bleed-right", "bleed-top-right", "bleed-bottom-right"];
export type CuratedPickSlideSpec = {
  template: "curated-pick"; id: string; background: SocialBackgroundKey;
  name: SocialTextBlock; hook: SocialTextBlock; detail: string; location: string; price: string;
  visualMode: CuratedVisualMode;
  photo: { url: string | null; focus: CuratedPhotoFocus };
  graphic: { assetId: string | null; placement: CuratedGraphicPlacement };
  /** Lab recipe v3: composition is independent of the uploaded medium. */
  treatment?: 'visual-above' | 'visual-below';
  visual?: { assetId: string | null; fit: 'cover' | 'contain' | 'frame'; focus: CuratedPhotoFocus; background: SocialBackgroundKey; scale?: SocialGraphicScale };
};
export type PostSlideSpec = EditorialCoverSlideSpec | CuratedPickSlideSpec | ListSlideSpec;
export type PostSlideTemplate = PostSlideSpec["template"];
export const POST_SLIDE_TEMPLATES: readonly PostSlideTemplate[] = ["editorial-cover", "curated-pick", "list"];
export const POST_SLIDE_LABELS: Record<PostSlideTemplate, string> = { "editorial-cover": "Editorial Cover", "curated-pick": "Curated Pick", list: "List" };
/** Kept as the established name for the slide union. */
export type CuratedSlideSpec = PostSlideSpec;
export type CuratedPostSpec = { slides: PostSlideSpec[] };

/** Generic post shape for the future standalone renderer; legacy recipes adapt to one slide. */
export type SocialSlide = CuratedSlideSpec | { template: "single"; id: string; spec: SocialPostSpec };
export type SocialPost = { wordmark: SocialWordmarkSetting; slides: SocialSlide[] };
export function toSocialPost(spec: SocialPostSpec): SocialPost {
  const wordmark = spec.wordmark ?? "default";
  if (spec.recipe === "curated-picks") return { wordmark, slides: curatedPost(spec).slides };
  return { wordmark, slides: [{ template: "single", id: "single", spec }] };
}

const text = (value: string): SocialTextBlock => ({ text: value, style: defaultTextStyle() });
const newId = (): string => crypto.randomUUID();

export function createEditorialCover(id = newId()): EditorialCoverSlideSpec {
  return { template: "editorial-cover", id, background: "sunshine", kicker: text("5 family adventures for spring"), headline: text("Melbourne's best picks for little explorers"), supporting: text("Saved by parents, tested by kids"), hero: { assetId: null, scale: "large", placement: "bottom-right" }, accents: [] };
}
export function createListSlide(id = newId()): ListSlideSpec {
  return { template: "list", id, list: defaultListSpec() };
}
export function createSlide(template: PostSlideTemplate, id = newId()): PostSlideSpec {
  return template === "editorial-cover" ? createEditorialCover(id) : template === "list" ? createListSlide(id) : createCuratedPick(id);
}

/** Explicit adapter for the retired curated-cover: count folds into the kicker, nothing else is lost. */
export function migrateCuratedCover(old: LegacyCuratedCoverSlide): EditorialCoverSlideSpec {
  const count = (old.count ?? "").trim();
  const base = createEditorialCover(old.id);
  return {
    ...base, background: old.background ?? base.background,
    kicker: text(count ? (/^\d+$/.test(count) ? `${count} top picks` : count) : "Our top picks"),
    headline: old.headline ?? base.headline, supporting: old.supporting ?? base.supporting,
    hero: { assetId: old.hero?.assetId ?? null, scale: old.hero?.scale ?? "large", placement: old.hero?.placement === "bottom" ? "bottom" : "bottom-right" },
    accents: normaliseCoverAccents(old.accents ?? []),
  };
}
/** Returns a valid slide, or null for unrecognised/corrupt input (dropped gracefully). */
export function migratePostSlide(value: unknown): PostSlideSpec | null {
  if (!value || typeof value !== "object") return null;
  const slide = value as { template?: unknown; id?: unknown };
  if (typeof slide.id !== "string") return null;
  if (slide.template === "curated-cover") return migrateCuratedCover(value as LegacyCuratedCoverSlide);
  if (slide.template === "editorial-cover" || slide.template === "curated-pick") return value as PostSlideSpec;
  if (slide.template === "list") return (value as ListSlideSpec).list?.items ? value as PostSlideSpec : null;
  return null;
}
/** Normalise any stored slides[]; identity is preserved when nothing needs migrating. */
export function normalisePostSlides(slides: readonly unknown[] | undefined): PostSlideSpec[] {
  if (!Array.isArray(slides)) return defaultCuratedPost().slides;
  const out = slides.map(migratePostSlide).filter((slide): slide is PostSlideSpec => !!slide);
  return out.length ? out : defaultCuratedPost().slides;
}
export function createCuratedPick(id = newId()): CuratedPickSlideSpec {
  return { template: "curated-pick", id, background: "warmLight", name: text("Ceres Community Park"), hook: text("Chooks, veggie patches and a creek to explore"), detail: "Grab a babycino at the café after.", location: "Brunswick East", price: "Free", visualMode: "photo", photo: { url: null, focus: "center" }, graphic: { assetId: null, placement: "bleed-right" } };
}
export function defaultCuratedPost(): CuratedPostSpec {
  return { slides: [createEditorialCover("cover-sample"), createCuratedPick("pick-sample")] };
}
const curatedCache = new WeakMap<object, CuratedPostSpec>();
export function curatedPost(spec: Pick<SocialPostSpec, "curated">): CuratedPostSpec {
  const raw = spec.curated;
  if (!raw?.slides?.length) return defaultCuratedPost();
  if ((raw.slides as unknown[]).every((slide) => (slide as { template?: string })?.template !== "curated-cover" && migratePostSlide(slide) === slide)) return raw;
  const cached = curatedCache.get(raw);
  if (cached) return cached;
  const next = { slides: normalisePostSlides(raw.slides) };
  curatedCache.set(raw, next);
  return next;
}
export const clampSlideIndex = (slides: readonly unknown[], index: number) => Math.max(0, Math.min(slides.length - 1, Number.isFinite(index) ? Math.trunc(index) : 0));

/** Pick numbering derives from Curated Pick order only (covers/lists are skipped): 01, 02, … */
export function pickNumber(slides: readonly CuratedSlideSpec[], index: number): string | null {
  if (slides[index]?.template !== "curated-pick") return null;
  const n = slides.slice(0, index + 1).filter((slide) => slide.template === "curated-pick").length;
  return String(n).padStart(2, "0");
}

export function addSlide(slides: readonly CuratedSlideSpec[], afterIndex: number, template: PostSlideTemplate, id = newId()) {
  const at = clampSlideIndex(slides, afterIndex) + 1;
  return { slides: [...slides.slice(0, at), createSlide(template, id), ...slides.slice(at)], index: at };
}
export const addPick = (slides: readonly CuratedSlideSpec[], afterIndex: number, id = newId()) => addSlide(slides, afterIndex, "curated-pick", id);
export function duplicateSlide(slides: readonly CuratedSlideSpec[], index: number, id = newId()) {
  const at = clampSlideIndex(slides, index);
  const source = slides[at];
  const copy = { ...structuredClone(source), id } as CuratedSlideSpec;
  if (copy.template === "editorial-cover") copy.accents = copy.accents.map((accent, i) => ({ ...accent, id: `${id}-accent-${i}` }));
  if (copy.template === "list") copy.list = { ...copy.list, items: copy.list.items.map((item, i) => ({ ...item, id: `${id}-item-${i}` })) };
  return { slides: [...slides.slice(0, at + 1), copy, ...slides.slice(at + 1)], index: at + 1 };
}
/** The last remaining slide cannot be deleted. */
export function deleteSlide(slides: readonly CuratedSlideSpec[], index: number) {
  if (slides.length <= 1) return { slides: slides.slice(), index: 0 };
  const at = clampSlideIndex(slides, index);
  const next = slides.filter((_, i) => i !== at);
  return { slides: next, index: Math.min(at, next.length - 1) };
}
export function moveSlide(slides: readonly CuratedSlideSpec[], index: number, delta: -1 | 1) {
  const at = clampSlideIndex(slides, index), to = at + delta;
  if (to < 0 || to >= slides.length) return { slides: slides.slice(), index: at };
  const next = slides.slice(); [next[at], next[to]] = [next[to], next[at]];
  return { slides: next, index: to };
}

/** Price is required on every pick ("Free" is valid). */
export function curatedPickErrors(slide: CuratedPickSlideSpec): string[] {
  const errors: string[] = [];
  if (!slide.price.trim()) errors.push("Price is required (e.g. Free, $12, From $20).");
  if (!slide.name.text.trim()) errors.push("Name is required.");
  return errors;
}
export function curatedPostErrors(slides: readonly CuratedSlideSpec[]): string[] {
  return slides.flatMap((slide, index) => slide.template === "curated-pick" ? curatedPickErrors(slide).map((e) => `Slide ${index + 1}: ${e}`) : []);
}

/** Visual resolution: missing source yields an empty template-owned field, never a sticker fallback. */
export function resolvePickVisual(slide: CuratedPickSlideSpec): { mode: "photo"; url: string; focus: CuratedPhotoFocus } | { mode: "graphic"; assetId: string; placement: CuratedGraphicPlacement } | { mode: "none" } {
  if (slide.visualMode === "photo") return slide.photo.url ? { mode: "photo", url: slide.photo.url, focus: slide.photo.focus } : { mode: "none" };
  return slide.graphic.assetId ? { mode: "graphic", assetId: slide.graphic.assetId, placement: slide.graphic.placement } : { mode: "none" };
}

/** Native px boxes for bleed graphics; boxes may extend past the canvas edge and are clipped by the stage. */
export const CURATED_GRAPHIC_BOXES: Record<CuratedGraphicPlacement, { left: number; top: number; width: number; height: number; objectPosition: string }> = {
  "bleed-right": { left: 300, top: 40, width: 900, height: 780, objectPosition: "right center" },
  "bleed-top-right": { left: 340, top: -120, width: 860, height: 860, objectPosition: "right top" },
  "bleed-bottom-right": { left: 320, top: 180, width: 880, height: 700, objectPosition: "right bottom" },
};
export const CURATED_PHOTO_HEIGHT = 780; // ~58% of 1350
/** Editorial Cover hero sits in the lower zone, so the headline keeps full width. */
export const EDITORIAL_COVER_HERO_SIZES: Record<SocialGraphicScale, number> = { small: 360, medium: 440, large: 520 };

/** Cover accents are always kind "accent" and capped at the shared overlay limit. */
export function normaliseCoverAccents(accents: readonly SocialGraphicOverlay[]): SocialGraphicOverlay[] {
  return accents.slice(0, SOCIAL_OVERLAY_LIMIT).map((accent) => clampOverlay({ ...accent, kind: "accent" }));
}

