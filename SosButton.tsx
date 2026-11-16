import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";

type Props = { onTrigger: () => void; armed?: boolean };

export function SosButton({ onTrigger, armed }: Props) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [firing, setFiring] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const HOLD_MS = 1200;

  const tick = () => {
    if (startRef.current == null) return;
    const p = Math.min(1, (performance.now() - startRef.current) / HOLD_MS);
    setHoldProgress(p);
    if (p >= 1) { fire(); return; }
    rafRef.current = requestAnimationFrame(tick);
  };

  const fire = () => {
    cancel();
    setFiring(true);
    onTrigger();
    setTimeout(() => setFiring(false), 1200);
  };

  const begin = () => {
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  };
  const cancel = () => {
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHoldProgress(0);
  };

  useEffect(() => () => cancel(), []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <div className="pulse-ring absolute inset-0 rounded-full" aria-hidden />
        <button
          type="button"
          aria-label="Trigger SOS"
          onPointerDown={begin}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          onClick={fire}
          className="relative z-10 grid h-56 w-56 place-items-center rounded-full bg-sos-gradient text-sos-foreground shadow-glow transition-transform active:scale-95 sm:h-64 sm:w-64"
        >
          <div
            className="absolute inset-2 rounded-full border-2 border-sos-foreground/30"
            style={{
              background: `conic-gradient(var(--sos-foreground) ${holdProgress * 360}deg, transparent 0)`,
              opacity: holdProgress > 0 ? 0.35 : 0,
              transition: "opacity 120ms",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Shield className="h-10 w-10" />
            <span className="font-display text-4xl font-bold tracking-wider">SOS</span>
            <span className="text-xs uppercase tracking-[0.25em] opacity-80">
              {firing ? "Sending…" : "Hold or tap"}
            </span>
          </div>
        </button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {armed ? "Voice & location armed — listening for distress words" : "Tap to alert your trusted circle instantly"}
      </p>
    </div>
  );
}
