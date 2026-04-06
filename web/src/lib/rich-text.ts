export function hasLexicalContent(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const root = (data as { root?: { children?: unknown[] } }).root;
  return Boolean(root?.children && root.children.length > 0);
}
