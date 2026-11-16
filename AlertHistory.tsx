import { Clock, ExternalLink, Mic, Hand } from "lucide-react";
import { mapsLink, type AlertEvent } from "@/lib/safety-store";

const fmt = (t: number) => new Date(t).toLocaleString();
const Icon = ({ trigger }: { trigger: AlertEvent["trigger"] }) =>
  trigger === "voice" ? <Mic className="h-4 w-4" /> : <Hand className="h-4 w-4" />;

export function AlertHistory({ alerts }: { alerts: AlertEvent[] }) {
  return (
    <section className="rounded-2xl border border-border/50 bg-surface/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-xl">Alert history</h2>
      </div>
      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You haven't sent any alerts yet. Stay safe.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.slice(0, 8).map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent">
                  <Icon trigger={a.trigger} />
                </span>
                <div>
                  <div className="text-sm font-medium capitalize">{a.trigger} alert</div>
                  <div className="text-xs text-muted-foreground">
                    {fmt(a.at)} · sent to {a.contacts.length} contact{a.contacts.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              {a.lat && a.lng && (
                <a
                  href={mapsLink(a.lat, a.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View map <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
