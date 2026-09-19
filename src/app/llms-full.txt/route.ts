import { baseURL, person, home, about, social } from "@/resources";
import { getPosts } from "@/utils/utils";

export async function GET() {
  const projects = getPosts(["src", "app", "work", "projects"]);
  const blogPosts = getPosts(["src", "app", "blog", "posts"]);

  // Format Work Experiences
  const workExperiences = about.work.experiences
    .map((exp) => {
      const achievements = exp.achievements.map((ach) => `  - ${ach}`).join("\n");
      return `### ${exp.role} at ${exp.company} (${exp.timeframe})\n${achievements}`;
    })
    .join("\n\n");

  // Format Technical Skills
  const skills = about.technical.skills
    .map((skillGroup) => {
      const tags = skillGroup.tags?.map((t) => t.name).join(", ") || "";
      return `- **${skillGroup.title}**: ${tags}`;
    })
    .join("\n");

  // Format Projects with full MDX body
  const formattedProjects = projects
    .map((p) => {
      return `---
## Project: ${p.metadata.title}
- **Slug**: ${p.slug}
- **Published**: ${p.metadata.publishedAt || "N/A"}
- **Summary**: ${p.metadata.summary || p.metadata.subtitle || "N/A"}
- **URL**: ${baseURL}/work/${p.slug}
${p.metadata.link ? `- **Live Project Link**: ${p.metadata.link}` : ""}
${p.metadata.source ? `- **Source Code**: ${p.metadata.source}` : ""}

### Content
${p.content.trim()}
`;
    })
    .join("\n\n");

  // Format Blog Posts with full MDX body
  const formattedBlogPosts = blogPosts
    .map((b) => {
      return `---
## Blog Post: ${b.metadata.title}
- **Slug**: ${b.slug}
- **Published**: ${b.metadata.publishedAt || "N/A"}
- **Summary**: ${b.metadata.summary || "N/A"}
- **URL**: ${baseURL}/blog/${b.slug}

### Content
${b.content.trim()}
`;
    })
    .join("\n\n");

  const socialLinks = social
    .map((s) => `- ${s.name}: ${s.link}`)
    .join("\n");

  const content = `# ${person.name} - Full Portfolio & Site Content (AI Readable)

> ${home.description}

## About ${person.name}
- **Name**: ${person.name}
- **Role**: ${person.role}
- **Location**: Uyo, Nigeria (${person.location})
- **Email**: ${person.email}
- **Website**: ${baseURL}

### Bio
Kamy Ewang is a Software Engineer based in Uyo, Nigeria, specializing in AI-powered full-stack applications, real-time platforms, Cyber Threat Intelligence, and modern web development with React, Next.js, Node.js, Python, and Flask.

## Work Experience
${workExperiences}

## Technical Skills
${skills}

## Portfolio Projects
${formattedProjects}

## Blog Articles & Posts
${formattedBlogPosts}

## Connect & Social Links
${socialLinks}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
