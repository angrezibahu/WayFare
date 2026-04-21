import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addEntry, deleteEntry } from '../lib/db';
import { useEntries } from '../lib/useEntries';
import { allChapters, allCards, cardById, chapterById } from '../lib/content';
function todayIso() {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export default function Fieldbook() {
    const entries = useEntries();
    const chapters = useMemo(() => allChapters(), []);
    const cards = useMemo(() => allCards(), []);
    const [params, setParams] = useSearchParams();
    const preset = params.get('challenge') ?? '';
    const [date, setDate] = useState(todayIso());
    const [author, setAuthor] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [challengeId, setChallengeId] = useState(preset);
    const [body, setBody] = useState('');
    const [sighting, setSighting] = useState(false);
    useEffect(() => {
        if (preset && !challengeId)
            setChallengeId(preset);
    }, [preset, challengeId]);
    async function onSubmit(e) {
        e.preventDefault();
        if (!body.trim())
            return;
        const entry = {
            date: new Date(date + 'T12:00:00').toISOString(),
            body: body.trim(),
            author: author.trim() || undefined,
            chapter_id: chapterId || undefined,
            challenge_id: challengeId || undefined,
            tags: sighting ? ['sighting'] : [],
        };
        await addEntry(entry);
        setBody('');
        setSighting(false);
        setChallengeId('');
        if (params.get('challenge')) {
            params.delete('challenge');
            setParams(params, { replace: true });
        }
    }
    async function onDelete(id) {
        if (!confirm('Delete this entry? This cannot be undone.'))
            return;
        await deleteEntry(id);
    }
    function exportMarkdown() {
        const lines = ['# WayFare Fieldbook export', ''];
        for (const e of entries) {
            lines.push('---');
            lines.push(`date: ${e.date.slice(0, 10)}`);
            if (e.author)
                lines.push(`author: ${e.author}`);
            if (e.chapter_id)
                lines.push(`chapter: ${e.chapter_id}`);
            if (e.challenge_id)
                lines.push(`challenge: ${e.challenge_id}`);
            if (e.tags && e.tags.length)
                lines.push(`tags: [${e.tags.join(', ')}]`);
            lines.push('---');
            lines.push('');
            lines.push(e.body);
            lines.push('');
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wayfare-fieldbook-${todayIso()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "Fieldbook" }), _jsx("p", { className: "muted", children: "A local log. Lives on this device. Export it as Markdown to commit it to the family repo once a year \u2014 that is the archive." }), _jsx("h2", { children: "New entry" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "date", children: "Date" }), _jsx("input", { id: "date", type: "date", value: date, onChange: (e) => setDate(e.target.value) })] }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "author", children: "Who wrote this (optional)" }), _jsx("input", { id: "author", value: author, onChange: (e) => setAuthor(e.target.value), placeholder: "e.g. Noor" })] }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "chapter", children: "Linked chapter (optional)" }), _jsxs("select", { id: "chapter", value: chapterId, onChange: (e) => setChapterId(e.target.value), children: [_jsx("option", { value: "", children: "\u2014" }), chapters.map((c) => (_jsx("option", { value: c.id, children: c.title }, c.id)))] })] }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "challenge", children: "Linked challenge (optional)" }), _jsxs("select", { id: "challenge", value: challengeId, onChange: (e) => setChallengeId(e.target.value), children: [_jsx("option", { value: "", children: "\u2014" }), cards.map((c) => (_jsx("option", { value: c.id, children: c.title }, c.id)))] })] }), _jsx("div", { className: "form-row", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: sighting, onChange: (e) => setSighting(e.target.checked), style: { width: 'auto', marginRight: '0.4rem' } }), "This was a sighting (helps unlock related chapters)"] }) }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "body", children: "What happened" }), _jsx("textarea", { id: "body", value: body, onChange: (e) => setBody(e.target.value), placeholder: "What you saw, where you were, who was with you, what you learned\u2026" })] }), _jsx("div", { className: "toolbar", children: _jsx("button", { type: "submit", disabled: !body.trim(), children: "Save entry" }) })] }), _jsx("h2", { children: entries.length === 0 ? 'No entries yet' : 'Entries' }), entries.length === 0 ? (_jsx("p", { className: "muted", children: "Write your first one above. Go outside first if you can." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "toolbar", children: _jsx("button", { type: "button", onClick: exportMarkdown, children: "Export as Markdown" }) }), entries.map((e) => (_jsxs("div", { className: "entry", children: [_jsxs("div", { className: "when", children: [new Date(e.date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    }), e.author ? ` · ${e.author}` : '', e.chapter_id ? ` · ${chapterById(e.chapter_id)?.title ?? e.chapter_id}` : '', e.challenge_id ? ` · ${cardById(e.challenge_id)?.title ?? e.challenge_id}` : '', e.tags && e.tags.length ? ` · ${e.tags.join(', ')}` : ''] }), _jsx("div", { className: "body", children: e.body }), _jsx("div", { className: "toolbar", children: _jsx("button", { type: "button", onClick: () => onDelete(e.id), children: "Delete" }) })] }, e.id)))] }))] }));
}
