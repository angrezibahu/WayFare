import { useEffect, useState } from 'react';

const STORAGE_KEY = 'wayfare_intro_seen';

export function useOverviewPopover() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  return { open, dismiss, reopen: () => setOpen(true) };
}

export function OverviewPopover({ open, onDismiss }: { open: boolean; onDismiss: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="overview-overlay" onClick={onDismiss}>
      <div className="overview-panel" role="dialog" aria-modal="true" aria-label="About WayFare" onClick={e => e.stopPropagation()}>
        <h2 className="overview-title">Welcome to WayFare</h2>
        <p>
          WayFare is a family apprenticeship in navigation and sky-reading, built around a
          physical paper Fieldbook and a deck of real-world Challenge cards. The paper is the
          point — this app is a companion that lives in your pocket when you are outside.
        </p>
        <dl className="overview-guide">
          <dt>Tonight's sky</dt>
          <dd>Moon phase, sunrise and sunset times, and the featured constellation. A good place to start each session.</dd>
          <dt>Chapters</dt>
          <dd>Illustrated guides on navigation, sky reading, and seasonal topics. Chapters unlock by season and location.</dd>
          <dt>Challenges</dt>
          <dd>Draw a card from the deck for a real-world task to try outside — Starter, Core, or Stretch difficulty.</dd>
          <dt>Fieldbook</dt>
          <dd>Log what you observe. Entries are stored locally on your device and can be exported as plain text.</dd>
          <dt>Printables</dt>
          <dd>Fieldbook page templates and star charts to print and carry into the field.</dd>
        </dl>
        <p className="small muted">
          No accounts. No cloud sync. Everything stays on your device.
        </p>
        <div className="toolbar">
          <button onClick={onDismiss}>Start exploring</button>
        </div>
      </div>
    </div>
  );
}
