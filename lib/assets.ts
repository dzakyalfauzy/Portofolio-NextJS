/**
 * Asset path helper — prepends basePath for <img> tags.
 * next/image handles basePath automatically, but plain <img> does not.
 */
const BASE = "/Portofolio-NextJS";

export function asset(path: string): string {
    return `${BASE}${path}`;
}
