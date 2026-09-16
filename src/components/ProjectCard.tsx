"use client";

import {
  AvatarGroup,
  Card,
  Carousel,
  Column,
  Flex,
  Heading,
  Media,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  source?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  source,
}) => {
  const hasDetails = avatars?.length > 0 || description?.trim() || content?.trim();

  return (
    <Card
      fillWidth
      fillHeight
      direction="column"
      border="neutral-alpha-weak"
      background="surface"
      radius="l"
      overflow="hidden"
      transition="micro-medium"
      className={styles.card}
    >
      {images.length > 1 ? (
        <Carousel
          priority={priority}
          sizes="(max-width: 960px) 100vw, 480px"
          items={images.map((image) => ({
            slide: image,
            alt: title,
          }))}
        />
      ) : (
        images.length === 1 && (
          <Media
            priority={priority}
            className={styles.image}
            sizes="(max-width: 960px) 100vw, 480px"
            aspectRatio="16 / 9"
            radius="none"
            alt={`Thumbnail of ${title}`}
            src={images[0]}
          />
        )
      )}
      {hasDetails && (
        <Column fillWidth padding="l" gap="m" vertical="between" flex={1}>
          <Column fillWidth gap="12">
            {title && (
              <Heading as="h2" wrap="balance" variant="heading-strong-m">
                {title}
              </Heading>
            )}
            {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="s" reverse />}
            {description?.trim() && (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </Text>
            )}
          </Column>
          <Flex gap="24" wrap paddingTop="8">
            {content?.trim() && (
              <SmartLink
                suffixIcon="arrowRight"
                style={{ margin: "0", width: "fit-content" }}
                href={href}
              >
                <Text variant="body-default-s">Read case study</Text>
              </SmartLink>
            )}
            {link && (
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={link}
              >
                <Text variant="body-default-s">View project</Text>
              </SmartLink>
            )}
            {source && (
              <SmartLink
                suffixIcon="github"
                style={{ margin: "0", width: "fit-content" }}
                href={source}
              >
                <Text variant="body-default-s">View source</Text>
              </SmartLink>
            )}
          </Flex>
        </Column>
      )}
    </Card>
  );
};