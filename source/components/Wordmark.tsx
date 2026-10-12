import { MapPin, Heart } from "lucide-react";

type Size = "sm" | "md" | "lg";

const TEXT_SIZE: Record<Size, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

const PIN_PX: Record<Size, number> = {
  sm: 20,
  md: 24,
  lg: 34,
};

const HEART_PX: Record<Size, number> = {
  sm: 8,
  md: 10,
  lg: 14,
};

/**
 * The Playmap icon: a teal MapPin with a small white Heart cutout centered inside.
 */
export function Mark({
  size,
  pinColor = "var(--primary)",
  heartColor = "#FFFFFF",
  className = "",
}: {
  /** Pixel size of the pin. */
  size: number;
  pinColor?: string;
  heartColor?: string;
  className?: string;
}) {
  const heartPx = size * (10 / 24);
  return (
    <span
      className={`relative inline-flex shrink-0 items-start justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <MapPin
        style={{ width: size, height: size, color: pinColor }}
        fill="currentColor"
        strokeWidth={1.5}
      />
      <Heart
        className="absolute"
        style={{
          width: heartPx,
          height: heartPx,
          color: heartColor,
          top: size * 0.22,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        fill="currentColor"
        strokeWidth={0}
      />
    </span>
  );
}

/**
 * The Playmap wordmark: lowercase "the playmap" in Instrument Sans 600,
 * in the primary brand teal. Text only.
 */
export function Wordmark({
  size = "md",
  className = "",
  color = "var(--primary)",
}: {
  size?: Size;
  className?: string;
  /** CSS colour value; use "inherit" when the surrounding composition controls the brand colour. */
  color?: string;
}) {
  return (
    <span
      aria-label="the playmap"
      className={`font-display font-semibold tracking-tight leading-none ${TEXT_SIZE[size]} ${className}`}
      style={{
        color,
        fontFamily: '"Instrument Sans Variable", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      the playmap
    </span>
  );
}

/** Full lockup: wordmark text plus the pin/heart mark. */
export function Logo({
  size = "md",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <span
      aria-label="the playmap"
      className={`inline-flex items-center gap-0.5 leading-none ${className}`}
    >
      <Wordmark size={size} />
      <Mark size={PIN_PX[size]} />
    </span>
  );
}

