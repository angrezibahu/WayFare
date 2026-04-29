import { useEffect } from 'react';
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import TonightsSky from './screens/TonightsSky';
import Chapters from './screens/Chapters';
import ChapterView from './screens/ChapterView';
import Challenges from './screens/Challenges';
import Fieldbook from './screens/Fieldbook';
import Printables from './screens/Printables';
import About from './screens/About';
import TryThis from './screens/TryThis';
import { useDayNight } from './lib/useDayNight';
import { OverviewPopover, useOverviewPopover } from './OverviewPopover';

const THEME_COLOR = { day: '#bcdcf2', night: '#1c2230' } as const;
const ICON_192 = { day: './icon-day-192.svg', night: './icon-night-192.svg' } as const;
const ICON_512 = { day: './icon-day-512.svg', night: './icon-night-512.svg' } as const;

function Nav({ mode, onAbout }: { mode: 'day' | 'night'; onAbout: () => void }) {
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        <span className="nav-brand">WayFare</span>
        <NavLink to="/sky" className={link}>
          {mode === 'day' ? "Today's sky" : "Tonight's sky"}
        </NavLink>
        <NavLink to="/chapters" className={link}>Chapters</NavLink>
        <NavLink to="/challenges" className={link}>Challenges</NavLink>
        <NavLink to="/fieldbook" className={link}>Fieldbook</NavLink>
        <NavLink to="/try-this" className={link}>Try This</NavLink>
        <NavLink to="/printables" className={link}>Printables</NavLink>
        <button className="nav-about" onClick={onAbout} aria-haspopup="dialog">About</button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        WayFare is a family project, shared in good faith. The paper Fieldbook is the real
        artefact; this app is a companion.{' '}
        <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">Stellarium</a>
        {' '}is better for sky maps. · <Link to="/about">About this project</Link>
      </p>
      <p>
        <strong>Sources & acknowledgements.</strong>{' '}
        Astronomical calculations follow standard algorithms (Jean Meeus,{' '}
        <em>Astronomical Algorithms</em>). Polynesian wayfinding draws on the tradition of
        Mau Piailug and the Polynesian Voyaging Society. Nakshatra material draws on
        classical Sanskrit astronomical texts. The WW2 escape-and-evasion material references
        MI9 and SOE training records. Egyptian, Greek, and Japanese cultural sections cite
        primary and secondary historical scholarship; sources are listed at the top of each
        chapter.
      </p>
      <p>
        No content is claimed as original research. If something is wrong, open an issue —
        the repository is public and corrections are welcome.
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav mode={mode} onAbout={reopen} />
      <main id="main-content" className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/sky" replace />} />
          <Route path="/sky" element={<TonightsSky />} />
          <Route path="/about" element={<About />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:id" element={<ChapterView />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/fieldbook" element={<Fieldbook />} />
          <Route path="/try-this" element={<TryThis />} />
          <Route path="/printables" element={<Printables />} />
          <Route path="*" element={<Navigate to="/sky" replace />} />
        </Routes>
      </main>
      <Footer />
      <OverviewPopover open={open} onDismiss={dismiss} />
    </>
  );
}
