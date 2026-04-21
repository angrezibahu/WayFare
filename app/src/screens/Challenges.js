import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allCards } from '../lib/content';
const GRADES = ['Starter', 'Core', 'Stretch'];
const KINDS = ['Sky', 'Land', 'Story', 'Error'];
export default function Challenges() {
    const cards = useMemo(() => allCards(), []);
    const [gradeFilter, setGradeFilter] = useState('');
    const [kindFilter, setKindFilter] = useState('');
    const [drawn, setDrawn] = useState(null);
    const filtered = cards.filter((c) => {
        if (gradeFilter && c.grade !== gradeFilter)
            return false;
        if (kindFilter && c.kind !== kindFilter)
            return false;
        return true;
    });
    function drawRandom() {
        if (filtered.length === 0)
            return;
        const n = Math.floor(Math.random() * filtered.length);
        setDrawn(filtered[n].id);
        // Scroll drawn card into view after render
        requestAnimationFrame(() => {
            const el = document.getElementById(`card-${filtered[n].id}`);
            if (el)
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "Challenges" }), _jsxs("p", { className: "muted", children: [cards.length, " cards. Draw one, choose one, or scroll. Most of them ask you to leave the house."] }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { type: "button", onClick: drawRandom, children: "Draw a card" }), _jsxs("select", { value: gradeFilter, onChange: (e) => setGradeFilter(e.target.value), "aria-label": "Filter by grade", children: [_jsx("option", { value: "", children: "any grade" }), GRADES.map((g) => (_jsx("option", { value: g, children: g }, g)))] }), _jsxs("select", { value: kindFilter, onChange: (e) => setKindFilter(e.target.value), "aria-label": "Filter by kind", children: [_jsx("option", { value: "", children: "any kind" }), KINDS.map((k) => (_jsx("option", { value: k, children: k }, k)))] })] }), filtered.map((card) => {
                const isDrawn = drawn === card.id;
                return (_jsxs("div", { id: `card-${card.id}`, className: "card", style: isDrawn ? { outline: '2px solid var(--ink)' } : undefined, children: [_jsx("h3", { children: card.title }), _jsxs("div", { children: [_jsx("span", { className: "tag", children: card.grade }), _jsx("span", { className: "tag", children: card.kind }), card.time ? _jsx("span", { className: "tag", children: card.time }) : null] }), _jsx("p", { style: { whiteSpace: 'pre-wrap' }, children: card.prompt.trim() }), card.fieldbook_prompt ? (_jsxs("p", { className: "small muted", style: { whiteSpace: 'pre-wrap' }, children: [_jsx("strong", { children: "Fieldbook prompt:" }), " ", card.fieldbook_prompt.trim()] })) : null, _jsxs("p", { className: "small muted italic", children: ["Provenance: ", card.provenance] }), _jsx(Link, { to: `/fieldbook?challenge=${encodeURIComponent(card.id)}`, children: _jsx("button", { type: "button", children: "Log this in the Fieldbook" }) })] }, card.id));
            })] }));
}
