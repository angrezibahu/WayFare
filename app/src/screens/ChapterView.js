import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chapterById } from '../lib/content';
import { resolveUnlock } from '../lib/unlock';
import { useEntries } from '../lib/useEntries';
import { useSettings } from '../lib/useSettings';
export default function ChapterView() {
    const { id } = useParams();
    const chapter = id ? chapterById(id) : undefined;
    const entries = useEntries();
    const { settings } = useSettings();
    if (!chapter) {
        return (_jsxs("div", { children: [_jsx("p", { className: "muted", children: "No such chapter." }), _jsx("p", { children: _jsx(Link, { to: "/chapters", children: "Back to chapters" }) })] }));
    }
    const status = resolveUnlock(chapter, {
        now: new Date(),
        hemisphere: settings.hemisphere ?? 'northern',
        entries,
    });
    if (!status.unlocked) {
        return (_jsxs("div", { children: [_jsx("p", { className: "muted", children: _jsx(Link, { to: "/chapters", children: "\u2190 all chapters" }) }), _jsx("h1", { children: chapter.title }), _jsxs("div", { className: "callout", children: [_jsx("strong", { children: "Locked." }), " ", status.reason] })] }));
    }
    return (_jsxs("article", { className: "prose", children: [_jsx("p", { className: "muted small", children: _jsx(Link, { to: "/chapters", children: "\u2190 all chapters" }) }), _jsx("h1", { children: chapter.title }), chapter.sources && chapter.sources.length > 0 ? (_jsxs("p", { className: "muted small italic", children: ["Sources: ", chapter.sources.join('; '), "."] })) : null, _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: chapter.body }), _jsx("hr", {}), _jsxs("div", { className: "toolbar", children: [_jsx(Link, { to: "/fieldbook", children: _jsx("button", { type: "button", children: "Add a Fieldbook entry" }) }), _jsx("button", { type: "button", onClick: () => window.print(), children: "Print this chapter" })] })] }));
}
