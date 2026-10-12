import { SOCIAL_PALETTE, type SocialTextStyle } from "./socialRenderer";

export type SocialTextPart = { text: string; colour: string };
export function resolveAccentEnding(style: Pick<SocialTextStyle, "accentEnding">): "none" | "last-word" {
  return style.accentEnding === "last-word" ? "last-word" : "none";
}
/** Colour-only parts: concatenation is exactly the input, including whitespace and punctuation. */
export function socialDisplayTextParts(text: string, baseColour: string, style: Pick<SocialTextStyle, "accentEnding" | "accentColour"> = {}): SocialTextPart[] {
  if (!text) return [];
  const colour = style.accentColour ? SOCIAL_PALETTE[style.accentColour]?.value : undefined;
  if (resolveAccentEnding(style) === "none" || !colour) return [{ text, colour: baseColour }];
  const match = /\S+(?=\s*$)/u.exec(text);
  if (!match) return [{ text, colour: baseColour }];
  const before = text.slice(0, match.index), after = text.slice(match.index + match[0].length);
  return [ ...(before ? [{ text: before, colour: baseColour }] : []), { text: match[0], colour }, ...(after ? [{ text: after, colour: baseColour }] : []) ];
}
