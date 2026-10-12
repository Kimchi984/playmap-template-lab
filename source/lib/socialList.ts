import { SOCIAL_CANVAS, SOCIAL_PALETTE, defaultTextStyle, type SocialBackgroundKey, type SocialGraphicScale, type SocialGraphicSlot, type SocialPaletteKey, type SocialTextBlock } from "./socialRenderer";
import { emptyFooterSlot } from "./socialFooter";

/** List Template v1: structured header / numbered list / footer zones; no freeform positioning. */
export const LIST_MIN_ITEMS = 3;
export const LIST_MAX_ITEMS = 13;
export const LIST_MAX_LINES_PER_ITEM = 3;
export const LIST_HEADER_HEIGHT = 360;
export const LIST_FOOTER_HEIGHT = 170;
export const LIST_ZONE_HEIGHT = SOCIAL_CANVAS.height - LIST_HEADER_HEIGHT - LIST_FOOTER_HEIGHT;
export const LIST_PADDING_X = 84;
export const LIST_COLUMN_GAP = 48;
/** Smallest layout scale the renderer may apply before reporting overflow instead. */
export const LIST_MIN_FIT_SCALE = 0.8;

export type ListColumnsSetting = "auto" | 1 | 2;
export type ListNumberStyle = "filled-circle" | "outlined-circle" | "plain" | "pill";
export const LIST_NUMBER_STYLES: readonly ListNumberStyle[] = ["filled-circle", "outlined-circle", "plain", "pill"];
export const LIST_NUMBER_STYLE_LABELS: Record<ListNumberStyle, string> = { "filled-circle": "Filled circle", "outlined-circle": "Outlined circle", plain: "Plain numeral", pill: "Pill / tab" };
export type ListDensity = "spacious" | "standard" | "compact";
export type ListPosition = "higher" | "auto" | "lower";
export const LIST_POSITION_OFFSETS: Record<ListPosition, number> = { higher: -32, auto: 0, lower: 32 };
export const LIST_HEADER_GAP = 64;
export const LIST_MIN_HEADER_GAP = 32;
export const LIST_FOOTER_GAP = 24;
/** Missing legacy placement resolves to Auto; all offsets yield to content safety. */
export function resolveListPosition(position?: ListPosition): ListPosition {
  return position === "higher" || position === "lower" ? position : "auto";
}
export function listVerticalLayout(headerBottom: number, listHeight: number, position?: ListPosition, motifHeight = 0) {
  const safeBottom = SOCIAL_CANVAS.height - Math.max(LIST_FOOTER_HEIGHT, motifHeight) - LIST_FOOTER_GAP;
  const minTop = Math.ceil(headerBottom) + LIST_MIN_HEADER_GAP;
  const desiredTop = Math.ceil(headerBottom) + LIST_HEADER_GAP + LIST_POSITION_OFFSETS[resolveListPosition(position)];
  const top = Math.max(minTop, Math.min(desiredTop, safeBottom - listHeight));
  return { top, safeBottom, availableHeight: Math.max(0, safeBottom - top), overflow: top + listHeight > safeBottom };
}
export const LIST_DENSITIES: readonly ListDensity[] = ["spacious", "standard", "compact"];
export type ListPrimaryWeight = "medium" | "bold";
export type ListNumberColour = { mode: "single"; colour: SocialPaletteKey } | { mode: "cycle" };
export type ListFooterVariant = "plain" | "search-pill";
export type SocialListItem = { id: string; primary: string; secondary: string; third: string };
export type SocialListSpec = {
  background: SocialBackgroundKey;
  headline: SocialTextBlock;
  subheading: SocialTextBlock;
  items: SocialListItem[];
  columns: ListColumnsSetting;
  numberStyle: ListNumberStyle;
  numberColour: ListNumberColour;
  density: ListDensity;
  position?: ListPosition;
  primaryWeight: ListPrimaryWeight;
  footer: { cta: SocialTextBlock; variant: ListFooterVariant; accentBefore?: SocialGraphicSlot; accentAfter?: SocialGraphicSlot; bottomMotif?: SocialGraphicSlot; /** Legacy CTA accent input; explicit accentAfter takes precedence, even None. */ graphic?: SocialGraphicSlot };
};
export function listFooterSlots(footer: SocialListSpec["footer"]) {
  return { accentBefore: footer.accentBefore ?? emptyFooterSlot(), accentAfter: footer.accentAfter ?? footer.graphic ?? emptyFooterSlot(), bottomMotif: footer.bottomMotif ?? emptyFooterSlot() };
}

/** Approved cycling sequence; colours matching the background are skipped. */
export const LIST_NUMBER_CYCLE: readonly SocialPaletteKey[] = ["sunshine", "pink", "poolBlue", "orange", "lilac", "aqua", "teal"];

export const canAddListItem = (items: readonly unknown[]) => items.length < LIST_MAX_ITEMS;
export const canRemoveListItem = (items: readonly unknown[]) => items.length > LIST_MIN_ITEMS;

export function autoListColumns(count: number): 1 | 2 { return count >= 9 ? 2 : 1; }
export function resolveListColumns(setting: ListColumnsSetting, count: number): 1 | 2 { return setting === "auto" ? autoListColumns(count) : setting; }
/** Top-to-bottom per column; left column takes the extra item (13 -> 7 + 6). */
export function distributeListColumns<T>(items: readonly T[], columns: 1 | 2): T[][] {
  if (columns === 1) return [items.slice()];
  const left = Math.ceil(items.length / 2);
  return [items.slice(0, left), items.slice(left)];
}

export const LIST_DENSITY_METRICS: Record<ListDensity, { gap: number; number: number; primary: number; secondary: number; third: number }> = {
  spacious: { gap: 44, number: 87, primary: 53, secondary: 34, third: 28 },
  standard: { gap: 30, number: 74, primary: 47, secondary: 30, third: 25 },
  compact: { gap: 18, number: 62, primary: 40, secondary: 27, third: 23 },
};
/** Count/column-aware base metrics: more rows or narrower columns => tighter type and spacing. */
export function listMetrics(density: ListDensity, count: number, columns: 1 | 2) {
  const rows = Math.ceil(count / columns);
  const rowFactor = Math.max(0.7, Math.min(1.08, 1 - (rows - 5) * 0.05));
  const factor = rowFactor * (columns === 2 ? 0.86 : 1);
  const base = LIST_DENSITY_METRICS[density];
  const round = (value: number) => Math.round(value * factor);
  // Narrow columns retain their established horizontal footprint and title sizes.
  const narrow = { spacious: { number: 76, primary: 50 }, standard: { number: 64, primary: 44 }, compact: { number: 54, primary: 38 } }[density];
  return { gap: round(base.gap), number: round(columns === 2 ? narrow.number : base.number), primary: round(columns === 2 ? narrow.primary : base.primary), secondary: round(base.secondary), third: round(base.third) };
}
export function listPrimaryFontWeight(weight: ListPrimaryWeight): number { return weight === "bold" ? 800 : 600; }
export function columnWidth(columns: 1 | 2): number {
  const inner = SOCIAL_CANVAS.width - LIST_PADDING_X * 2;
  return columns === 1 ? inner : (inner - LIST_COLUMN_GAP) / 2;
}

export function listNumberColour(mode: ListNumberColour, index: number, background: SocialPaletteKey): SocialPaletteKey {
  if (mode.mode === "single") return mode.colour;
  const cycle = LIST_NUMBER_CYCLE.filter((key) => key !== background);
  return cycle[index % cycle.length];
}
/** Visual treatment per controlled style; colours come only from the approved palette. */
export function listNumberTreatment(style: ListNumberStyle, colour: SocialPaletteKey, bodyText: string, size: number) {
  const value = SOCIAL_PALETTE[colour].value;
  const onFill = SOCIAL_PALETTE[colour].foreground === "white" ? "#FFFFFF" : "#0F7C78";
  switch (style) {
    case "filled-circle": return { width: size, height: size, borderRadius: size / 2, backgroundColor: value, color: onFill, border: "none", fontWeight: 800, fontSize: Math.round(size * .56) };
    case "outlined-circle": return { width: size, height: size, borderRadius: size / 2, backgroundColor: "transparent", color: bodyText, border: `${Math.max(4, Math.round(size / 12))}px solid ${value}`, fontWeight: 800, fontSize: Math.round(size * .56) };
    case "plain": return { width: size, height: size, borderRadius: 0, backgroundColor: "transparent", color: value, border: "none", fontWeight: 800, fontSize: Math.round(size * .95) };
    case "pill": return { width: Math.round(size * 1.35), height: Math.round(size * 0.78), borderRadius: Math.round(size * 0.12), backgroundColor: value, color: onFill, border: "none", fontWeight: 800, fontSize: Math.round(size * .58) };
  }
}

export type ListItemMeasurement = { index: number; lines: number };
export type ListFitReport = { overflow: boolean; tooManyLines: number[]; scale: number };
export function sameListFitReport(a: ListFitReport | null, b: ListFitReport): boolean {
  return !!a && a.overflow === b.overflow && a.scale === b.scale && a.tooManyLines.length === b.tooManyLines.length && a.tooManyLines.every((index, i) => index === b.tooManyLines[i]);
}
export function listFitReport(measurements: readonly ListItemMeasurement[], overflow: boolean, scale: number): ListFitReport {
  return { overflow, scale, tooManyLines: measurements.filter((item) => item.lines > LIST_MAX_LINES_PER_ITEM).map((item) => item.index) };
}
export function listFitWarnings(report: ListFitReport | null): string[] {
  if (!report) return [];
  const warnings = report.tooManyLines.map((index) => `Item ${index + 1} runs over ${LIST_MAX_LINES_PER_ITEM} lines — shorten its text.`);
  if (report.overflow) warnings.push("The list does not fit above the footer — shorten items, use Compact density or 2 columns.");
  return warnings;
}
/** Editor guidance only; rendered measurement is the final constraint. */
export function listCharGuidance(count: number, columns: 1 | 2) {
  const narrow = columns === 2 || count > 8;
  return { primary: narrow ? 26 : 38, secondary: narrow ? 30 : 46, third: narrow ? 30 : 46 };
}

export const LIST_FOOTER_GRAPHIC_SIZES: Record<SocialGraphicScale, number> = { small: 100, medium: 125, large: 150 };

const text = (value: string): SocialTextBlock => ({ text: value, style: defaultTextStyle() });
export function defaultListSpec(): SocialListSpec {
  const items: [string, string, string][] = [
    ["Lantern Parade", "Collingwood Children's Farm", "Sat 12 Oct · Free"],
    ["Teddy Bears' Picnic", "Royal Botanic Gardens", "Sun 13 Oct"],
    ["Splash Park Opening", "Werribee Park", ""],
    ["Kids' Bike Day", "Albert Park Lake", "Sat 19 Oct"],
    ["Dino Discovery Trail", "Melbourne Museum", "All week"],
    ["Pumpkin Patch Fun", "Yarra Valley", "Weekends"],
  ];
  return {
    background: "teal", headline: text("6 things to do with kids this weekend"), subheading: text("Melbourne · 12–13 October"),
    items: items.map(([primary, secondary, third], index) => ({ id: `sample-${index}`, primary, secondary, third })),
    columns: "auto", numberStyle: "filled-circle", numberColour: { mode: "cycle" }, density: "standard", position: "auto", primaryWeight: "bold",
    footer: { cta: text("Find these + more at theplaymap.com.au"), variant: "search-pill", accentBefore: emptyFooterSlot(), accentAfter: emptyFooterSlot(), bottomMotif: emptyFooterSlot() },
  };
}

