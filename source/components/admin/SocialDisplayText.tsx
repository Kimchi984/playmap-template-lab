import { socialDisplayTextParts } from "@/lib/socialDisplayText";
import type { SocialTextStyle } from "@/lib/socialRenderer";

/** Inline colour only: no font, spacing, wrappers or nonbreaking tokens to change fit. */
export function SocialDisplayText({ text, colour, style }: { text: string; colour: string; style: SocialTextStyle }) {
  return <>{socialDisplayTextParts(text, colour, style).map((part, index) => part.colour === colour ? part.text : <span key={index} style={{ color: part.colour }}>{part.text}</span>)}</>;
}
