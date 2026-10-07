import { getPosts } from "@/utils/utils";
import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import { ProjectShowcase, type ShowcaseItem } from "./ProjectShowcase";
import styles from "./WorkShowcase.module.scss";

export function WorkShowcase() {
  const items: ShowcaseItem[] = getPosts(["src", "app", "work", "projects"])
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .filter((post) => post.metadata.images && post.metadata.images.length > 0)
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary,
      image: post.metadata.preview || post.metadata.images[0],
      kind: post.metadata.kind === "app" ? "app" : "website",
      link: post.metadata.link || undefined,
    }));

  if (items.length === 0) return null;

  return (
    <Column as="section" fillWidth gap="12" paddingY="4" aria-label="Selected work">
      <Row fillWidth horizontal="center" className={styles.head}>
        <Heading as="h2" align="center" variant="heading-strong-l">
          Projects I&apos;ve shipped
        </Heading>
        <Row className={styles.allProjects}>
          <SmartLink href="/work" suffixIcon="arrowRight">
            <Text variant="body-default-s" onBackground="neutral-weak">
              All projects
            </Text>
          </SmartLink>
        </Row>
      </Row>
      <ProjectShowcase items={items} />
    </Column>
  );
}
