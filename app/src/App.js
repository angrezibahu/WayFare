import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import TonightsSky from './screens/TonightsSky';
import Chapters from './screens/Chapters';
import ChapterView from './screens/ChapterView';
import Challenges from './screens/Challenges';
import Fieldbook from './screens/Fieldbook';
function Nav() {
    const link = ({ isActive }) => (isActive ? 'active' : '');
    return (_jsx("nav", { className: "nav", children: _jsxs("div", { className: "nav-inner", children: [_jsx("span", { className: "nav-brand", children: "WayFare" }), _jsx(NavLink, { to: "/sky", className: link, children: "Tonight\u2019s sky" }), _jsx(NavLink, { to: "/chapters", className: link, children: "Chapters" }), _jsx(NavLink, { to: "/challenges", className: link, children: "Challenges" }), _jsx(NavLink, { to: "/fieldbook", className: link, children: "Fieldbook" })] }) }));
}
function Footer() {
    return (_jsx("footer", { className: "footer", children: _jsxs("p", { children: ["WayFare is a family apprenticeship. The paper Fieldbook is the real artefact; this app is a companion. ", _jsx("a", { href: "https://stellarium-web.org", target: "_blank", rel: "noreferrer", children: "Stellarium" }), "\u00A0is better for sky maps."] }) }));
}
export default function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Nav, {}), _jsx("main", { className: "page", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/sky", replace: true }) }), _jsx(Route, { path: "/sky", element: _jsx(TonightsSky, {}) }), _jsx(Route, { path: "/chapters", element: _jsx(Chapters, {}) }), _jsx(Route, { path: "/chapters/:id", element: _jsx(ChapterView, {}) }), _jsx(Route, { path: "/challenges", element: _jsx(Challenges, {}) }), _jsx(Route, { path: "/fieldbook", element: _jsx(Fieldbook, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/sky", replace: true }) })] }) }), _jsx(Footer, {})] }));
}
