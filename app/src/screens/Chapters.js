import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { allChapters } from '../lib/content';
import { resolveAll } from '../lib/unlock';
import { useEntries } from '../lib/useEntries';
import { useSettings } from '../lib/useSettings';
export default function Chapters() {
    const entries = useEntries();
    const { settings } = useSettings();
    const chapters = allChapters();
    const status = resolveAll(chapters, {
        now: new Date(),
        hemisphere: settings.hemisphere ?? 'northern',
        entries,
    });
    const grouped = {};
    for (const ch of chapters) {
        (grouped[ch.season] ??= []).push(ch);
    }
    const order = ['always', 'winter', 'spring', 'summer', 'autumn'];
    return (_jsxs("div", { children: [_jsx("h1", { children: "Chapters" }), _jsx("p", { className: "muted", children: "Some chapters are always open. Others wait for the real world to make them relevant \u2014 for winter to come, for the Moon to be drawn." }), order.map((season) => {
                const list = grouped[season] ?? [];
                if (list.length === 0)
                    return null;
                return (_jsxs("section", { children: [_jsx("h2", { children: labelFor(season) }), list.map((ch) => {
                            const s = status[ch.id];
                            if (s?.unlocked) {
                                return (_jsx(Link, { to: `/chapters/${ch.id}`, style: { textDecoration: 'none' }, children: _jsxs("div", { className: "card", children: [_jsx("h3", { children: ch.title }), _jsx("span", { className: "tag", children: ch.kind }), _jsx("span", { className: "tag", children: ch.season })] }) }, ch.id));
                            }
                            return (_jsxs("div", { className: "card locked", children: [_jsx("h3", { children: ch.title }), _jsx("span", { className: "tag", children: ch.kind }), _jsx("span", { className: "tag", children: ch.season }), _jsx("p", { className: "small", children: s?.reason ?? 'Locked.' })] }, ch.id));
                        })] }, season));
            })] }));
}
function labelFor(s) {
    if (s === 'always')
        return 'Always open';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
