import yaml from 'js-yaml';
const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
export function parseFrontMatter(src) {
    const match = src.match(FRONT_MATTER_RE);
    if (!match) {
        return { data: {}, content: src };
    }
    const yamlBody = match[1];
    const rest = src.slice(match[0].length);
    const data = (yaml.load(yamlBody) ?? {});
    return { data, content: rest };
}
