import { baseURL, person, home, about, social } from "@/resources";
import { getPosts } from "@/utils/utils";

export async function GET() {
  const projects = getPosts(["src", "app", "work", "projects"]);
  const blogPosts = getPosts(["src", "app", "blog", "posts"]);

  const projectList = projects
    .map(
      (p) =>
        `- [${p.metadata.title}](${baseURL}/work/${p.slug}): ${p.metadata.summary || p.metadata.subtitle || ""}`,
    )
    .join("\n");

  const blogList = blogPosts
    .map(
      (b) =>
        `- [${b.metadata.title}](${baseURL}/blog/${b.slug}): ${b.metadata.summary || ""}`,
    )
    .join("\n");

  const socialLinks = social
    .map((s) => `- ${s.name}: ${s.link}`)
    .join("\n");

  const content = `# ${person.name} - ${person.role}

> ${home.description}

## Core Information
- **Name**: ${person.name}
- **Role**: ${person.role}
- **Location**: Uyo, Nigeria (${person.location})
- **Email**: ${person.email}
- **Website**: ${baseURL}

## Complete Content Document
- [llms-full.txt](${baseURL}/llms-full.txt): Complete aggregated Markdown version of all portfolio projects, blog posts, resume, and experience.

## Key Projects
${projectList || "None listed"}

## Blog Posts & Articles
${blogList || "None listed"}

## Primary Navigation
- [Home](${baseURL}/)
- [About](${baseURL}/about)
- [Work](${baseURL}/work)
- [Blog](${baseURL}/blog)

## Social & Links
${socialLinks}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
