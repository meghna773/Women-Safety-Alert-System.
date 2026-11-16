import { MapPin, Mic, MicOff, Loader2 } from "lucide-react";
import type { GeoState } from "@/hooks/useGeolocation";

type Props = {
  geo: GeoState;
  listening: boolean;
  voiceSupported: boolean;
  transcript: string;
  onToggleVoice: () => void;
  keywords: string[];
};

export function StatusCard({ geo, listening, voiceSupported, transcript, onToggleVoice, keywords }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Location */}
      <div className="rounded-2xl border border-border/50 bg-surface/60 p-5 backdrop-blur">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> Live location
        </div>
        <div className="mt-3 font-display text-2xl">
          {geo.loading ? (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Locating…
            </span>
          ) : geo.lat && geo.lng ? (
            <span className="text-safe">Tracking active</span>
          ) : (
            <span className="text-accent">Location unavailable</span>
          )}
        </div>
        {geo.lat && geo.lng && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {geo.lat.toFixed(5)}, {geo.lng.toFixed(5)} · ±{Math.round(geo.accuracy ?? 0)}m
          </p>
        )}
        {geo.error && <p className="mt-1 text-xs text-accent">{geo.error}</p>}
      </div>

      {/* Voice */}
      <div className="rounded-2xl border border-border/50 bg-surface/60 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            {listening ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
            Voice trigger
          </div>
          <button
            onClick={onToggleVoice}
            disabled={!voiceSupported}
            className="rounded-full border border-border/60 px-3 py-1 text-xs hover:bg-secondary disabled:opacity-40"
          >
            {listening ? "Stop" : "Activate"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-8 items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-1 rounded-full ${listening ? "listening-bar bg-primary" : "bg-muted"}`}
                style={{ height: `${30 + i * 10}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <div className="font-display text-lg">
            {!voiceSupported ? "Not supported on this browser" : listening ? "Listening" : "Idle"}
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Trigger words:{" "}
          {keywords.map((k, i) => (
            <span key={k} className="font-mono">
              {i ? " · " : ""}“{k}”
            </span>
          ))}
        </p>
        {listening && transcript && (
          <p className="mt-2 truncate font-mono text-xs text-primary/80">…{transcript}</p>
        )}
      </div>
    </div>
  );
}
