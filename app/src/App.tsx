import { useEffect } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import TonightsSky from './screens/TonightsSky';
import Chapters from './screens/Chapters';
import ChapterView from './screens/ChapterView';
import Challenges from './screens/Challenges';
import Fieldbook from './screens/Fieldbook';
import Printables from './screens/Printables';
import { useDayNight } from './lib/useDayNight';
import { OverviewPopover, useOverviewPopover } from './OverviewPopover';

const THEME_COLOR = { day: '#bcdcf2', night: '#1c2230' } as const;
const ICON_192 = { day: './icon-day-192.svg', night: './icon-night-192.svg' } as const;
const ICON_512 = { day: './icon-day-512.svg', night: './icon-night-512.svg' } as const;

function Nav({ mode, onAbout }: { mode: 'day' | 'night'; onAbout: () => void }) {
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');
  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-brand">WayFare</span>
        <NavLink to="/sky" className={link}>
          {mode === 'day' ? "Today's sky" : "Tonight's sky"}
        </NavLink>
        <NavLink to="/chapters" className={link}>Chapters</NavLink>
        <NavLink to="/challenges" className={link}>Challenges</NavLink>
        <NavLink to="/fieldbook" className={link}>Fieldbook</NavLink>
        <NavLink to="/printables" className={link}>Printables</NavLink>
        <button className="nav-about" onClick={onAbout} title="About WayFare">About</button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        WayFare is a family apprenticeship. The paper Fieldbook is the real artefact;
        this app is a companion. <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">Stellarium</a>
        &nbsp;is better for sky maps.
      </p>
    </footer>
  );
}

function useApplyMode() {
  const mode = useDayNight();
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLOR[mode]);

    document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]').forEach((link) => {
      link.href = ICON_192[mode];
    });
    document
      .querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"]')
      .forEach((link) => {
        link.href = ICON_512[mode];
      });
  }, [mode]);
  return mode;
}

export default function App() {
  const mode = useApplyMode();
  const { open, dismiss, reopen } = useOverviewPopover();
  return (
    <>
      <Nav mode={mode} onAbout={reopen} />
      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/sky" replace />} />
          <Route path="/sky" element={<TonightsSky />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:id" element={<ChapterView />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/fieldbook" element={<Fieldbook />} />
          <Route path="/printables" element={<Printables />} />
          <Route path="*" element={<Navigate to="/sky" replace />} />
        </Routes>
      </main>
      <Footer />
      <OverviewPopover open={open} onDismiss={dismiss} />
    </>
  );
}
