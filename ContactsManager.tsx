import { useState } from "react";
import { Plus, Trash2, UserRound } from "lucide-react";
import type { Contact } from "@/lib/safety-store";

type Props = {
  contacts: Contact[];
  onChange: (c: Contact[]) => void;
};

export function ContactsManager({ contacts, onChange }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onChange([...contacts, { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim() }]);
    setName(""); setPhone("");
  };
  const remove = (id: string) => onChange(contacts.filter((c) => c.id !== id));

  return (
    <section className="rounded-2xl border border-border/50 bg-surface/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Trusted circle</h2>
        <span className="text-xs text-muted-foreground">{contacts.length} contacts</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        These people receive your live location the moment SOS fires.
      </p>

      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (e.g. +1 555 123 4567)"
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="mt-5 divide-y divide-border/40">
        {contacts.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No contacts yet. Add at least one to enable alerts.
          </li>
        )}
        {contacts.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{c.phone}</div>
              </div>
            </div>
            <button
              onClick={() => remove(c.id)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-accent"
              aria-label="Remove contact"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
