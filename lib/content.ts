import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";

const contentDir = path.join(process.cwd(), "content");

type MdxComponents = Parameters<typeof compileMDX>[0]["components"];

export type WorkFrontmatter = {
  order: number;
  title: string;
  subtitle: string;
  tagline: string;
  period: string;
  org: string;
  tags: string[];
  link?: string;
  demo?: string;
  motif: string;
};

export async function loadMdx<T extends Record<string, unknown>>(
  relPath: string,
  components?: MdxComponents,
) {
  const source = await fs.readFile(path.join(contentDir, relPath), "utf8");
  return compileMDX<T>({
    source,
    options: { parseFrontmatter: true },
    components,
  });
}

export async function listWorkSlugs() {
  const files = await fs.readdir(path.join(contentDir, "work"));
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

export async function loadWorkEntry(slug: string, components?: MdxComponents) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return await loadMdx<WorkFrontmatter>(`work/${slug}.mdx`, components);
  } catch {
    return null;
  }
}

export async function loadWorkEntries() {
  const slugs = await listWorkSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const { content, frontmatter } = await loadMdx<WorkFrontmatter>(
        `work/${slug}.mdx`,
      );
      return { slug, content, frontmatter };
    }),
  );
  return entries.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
