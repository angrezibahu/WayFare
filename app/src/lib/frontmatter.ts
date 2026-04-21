import yaml from 'js-yaml';

/** A minimal, browser-safe YAML front-matter parser. */
export interface ParsedMarkdown<T = unknown> {
  data: T;
  content: string;
}

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontMatter<T = unknown>(src: string): ParsedMarkdown<T> {
  const match = src.match(FRONT_MATTER_RE);
  if (!match) {
    return { data: {} as T, content: src };
  }
  const yamlBody = match[1];
  const rest = src.slice(match[0].length);
  const data = (yaml.load(yamlBody) ?? {}) as T;
  return { data, content: rest };
}
