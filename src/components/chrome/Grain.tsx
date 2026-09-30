/**
 * Paper grain: a small pre-rendered tile, repeated. It is a static texture on its own layer,
 * so it costs nothing while scrolling (the previous live SVG filter with a blend mode did).
 */
export function Grain() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] bg-[url('/noise.png')] bg-[length:256px_256px] opacity-[0.045]" />;
}
