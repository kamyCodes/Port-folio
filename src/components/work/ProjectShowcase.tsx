"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Column, Heading, Media, Text } from "@once-ui-system/core";
import styles from "./ProjectShowcase.module.scss";

export interface ShowcaseItem {
  slug: string;
  title: string;
  summary: string;
  image: string;
  /** "app" builds only live on as a case study; "website" has a page to visit. */
  kind: "app" | "website";
  link?: string;
}

interface ProjectShowcaseProps {
  items: ShowcaseItem[];
}

/** How long the centred project holds before the carousel moves on. */
const INTERVAL = 6000;

/** How far the pointer must travel before the drag counts as a swipe. */
const DRAG_THRESHOLD = 56;

/** Cover-flow geometry. All distances are relative to the card itself, so the
 *  whole stage scales with the space it is given. */
const MAX_OFFSET = 2;
const STEP = 70; // % of card width each neighbour steps aside
const TILT = 36; // degrees each neighbour rotates towards the centre
const SHRINK = 0.17; // scale lost per step away from the centre
const FADE = [1, 0.72, 0.3]; // opacity by distance from the centre

/** Under the pointer a card comes forward: it grows, eases towards the middle
 *  and straightens out so its preview reads clearly. Indexed by distance from
 *  the centre, so a far card only nudges rather than jumping into the middle. */
const HOVER_GROW = [1.08, 1.06, 1.03];
const HOVER_PULL = [1, 0.93, 0.88];
const HOVER_TILT = [1, 0.45, 0.3];

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ items }) => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [suspended, setSuspended] = useState(false);
  const [inView, setInView] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const swipedRef = useRef(false);

  // Respect reduced-motion: start paused, the carousel is still draggable
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  // Only autoplay while the carousel is on screen
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      setActive(((index % items.length) + items.length) % items.length);
    },
    [items.length]
  );

  // Move on to the next project on a timer. Hovering, focusing or dragging
  // anywhere in the carousel holds it still so the preview can be read.
  useEffect(() => {
    if (items.length < 2 || !playing || suspended || dragging || !inView) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [items.length, playing, suspended, dragging, inView]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const travelled = event.clientX - dragStart.current;
    dragStart.current = null;
    setDragging(false);
    setSuspended(false);
    if (trackRef.current) trackRef.current.style.transform = "";
    if (Math.abs(travelled) >= DRAG_THRESHOLD) {
      goTo(active + (travelled < 0 ? 1 : -1));
    }
    // Clear the swipe guard once the click that follows the release has been seen
    window.setTimeout(() => {
      swipedRef.current = false;
    }, 0);
  };

  if (items.length === 0) return null;

  const item = items[active];
  const position = String(active + 1).padStart(2, "0");
  const total = String(items.length).padStart(2, "0");

  return (
    <Column
      ref={containerRef}
      fillWidth
      className={`${styles.showcase}${hovered !== null ? ` ${styles.hovering}` : ""}`}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      onMouseEnter={() => setSuspended(true)}
      onMouseLeave={() => setSuspended(false)}
      onFocusCapture={() => setSuspended(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setSuspended(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${styles.stage}${dragging ? ` ${styles.stageDragging}` : ""}`}
        onPointerDown={(event) => {
          if (items.length < 2) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragStart.current = event.clientX;
          swipedRef.current = false;
          setDragging(true);
          setSuspended(true);
        }}
        onPointerMove={(event) => {
          if (dragStart.current === null) return;
          const travelled = event.clientX - dragStart.current;
          if (Math.abs(travelled) > 6 && !swipedRef.current) {
            swipedRef.current = true;
            // Only claim the pointer once a drag really starts: capturing on
            // pointerdown retargets the click that follows to the stage and
            // swallows the card's own link.
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Capture is a nicety: the drag still works without it.
            }
          }
          if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${travelled}px, 0, 0)`;
          }
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className={styles.track}>
          {items.map((entry, index) => {
            const offset = index - active;
            const distance = Math.abs(offset);
            const clamped = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset));
            const isActive = offset === 0;
            const isVisible = distance <= MAX_OFFSET;
            const isHovered = hovered === index;
            // Neighbours only feel the hover for the first couple of steps,
            // otherwise a far card would leap past the centred one.
            const tier = Math.min(distance, HOVER_GROW.length - 1);
            const grow = isHovered ? HOVER_GROW[tier] : 1;
            const step = clamped * STEP * (isHovered ? HOVER_PULL[tier] : 1);
            const tilt = clamped * -TILT * (isHovered ? HOVER_TILT[tier] : 1);

            // Apps have nothing to visit, so the card is the way into the
            // write-up; websites open live in a new tab.
            const visits = entry.kind === "website" && Boolean(entry.link);
            const href = visits ? (entry.link as string) : `/work/${entry.slug}`;

            return (
              <div
                key={entry.slug}
                className={`${styles.card}${isActive ? ` ${styles.cardActive}` : ""}${
                  isHovered ? ` ${styles.cardHover}` : ""
                }`}
                style={{
                  transform: [
                    "translate(-50%, -50%)",
                    `translateX(${step}%)`,
                    `rotateY(${tilt}deg)`,
                    `scale(${Math.max(0.5, 1 - distance * SHRINK) * grow})`,
                  ].join(" "),
                  zIndex: isHovered ? 120 : 100 - distance,
                  opacity: isVisible ? FADE[Math.min(distance, FADE.length - 1)] : 0,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
                aria-hidden={!isVisible}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
                onFocusCapture={() => setHovered(index)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setHovered((current) => (current === index ? null : current));
                  }
                }}
              >
                {/* The whole card is the primary action, so the overlay below
                    lets clicks through to it. */}
                <a
                  className={styles.cardLink}
                  href={href}
                  tabIndex={isActive ? 0 : -1}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={
                    visits
                      ? `${entry.title}, project ${index + 1} of ${items.length} — visit the live site (opens in a new tab)`
                      : `${entry.title}, project ${index + 1} of ${items.length} — read the case study`
                  }
                  target={visits ? "_blank" : undefined}
                  rel={visits ? "noopener noreferrer" : undefined}
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={(event) => {
                    // A swipe should never navigate, and tapping a flanking card
                    // brings it to the centre instead of opening it.
                    if (swipedRef.current || !isActive) {
                      event.preventDefault();
                      if (!swipedRef.current) goTo(index);
                    }
                  }}
                >
                  <Media
                    className={styles.media}
                    src={entry.image}
                    alt={`Preview of ${entry.title}`}
                    aspectRatio="16 / 9"
                    radius="none"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 620px"
                    priority={index === 0}
                  />
                  <span className={styles.scrim} aria-hidden="true" />
                </a>
                <span className={styles.overlay}>
                  <span className={styles.copy}>
                    <Heading as="h3" variant="heading-strong-s" className={styles.title}>
                      {entry.title}
                    </Heading>
                    <Text variant="body-default-xs" className={styles.summary}>
                      {entry.summary}
                    </Text>
                  </span>
                  <span className={styles.actions}>
                    {visits ? (
                      <a
                        className={styles.action}
                        href={`/work/${entry.slug}`}
                        tabIndex={isActive ? 0 : -1}
                      >
                        Case study
                      </a>
                    ) : (
                      <span className={styles.hint}>Case study</span>
                    )}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {item.title}, project {position} of {total}
      </p>
    </Column>
  );
};
