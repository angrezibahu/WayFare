import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import TonightsSky from './screens/TonightsSky';
import Chapters from './screens/Chapters';
import ChapterView from './screens/ChapterView';
import Challenges from './screens/Challenges';
import Fieldbook from './screens/Fieldbook';

function Nav() {
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');
  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-brand">WayFare</span>
        <NavLink to="/sky" className={link}>Tonight&rsquo;s sky</NavLink>
        <NavLink to="/chapters" className={link}>Chapters</NavLink>
        <NavLink to="/challenges" className={link}>Challenges</NavLink>
        <NavLink to="/fieldbook" className={link}>Fieldbook</NavLink>
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

export default function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/sky" replace />} />
          <Route path="/sky" element={<TonightsSky />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:id" element={<ChapterView />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/fieldbook" element={<Fieldbook />} />
          <Route path="*" element={<Navigate to="/sky" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
