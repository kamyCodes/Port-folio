import {
  AccordionGroup,
  Button,
  Card,
  Column,
  Grid,
  Heading,
  Icon,
  Line,
  Media,
  Meta,
  Row,
  Schema,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import { about, baseURL, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { CopyButton } from "@/components/CopyButton";
import {
  formatBytes,
  getLatestRelease,
  FALLBACK_RELEASE,
  LATEST_INSTALLER_NAME,
  RELEASES_LIST_URL,
  type ReleaseInfo,
} from "@/utils/githubRelease";

/**
 * Page data source: live GitHub release when reachable, hardcoded baseline
 * otherwise. Never null — the page always renders real version, changelog,
 * and checksum text instead of blank fields or a stuck loading state.
 */
async function loadRelease(): Promise<ReleaseInfo> {
  return (await getLatestRelease()) ?? FALLBACK_RELEASE;
}

const REPO = "https://github.com/kamyCodes/Aether";

const features = [
  {
    icon: "shield",
    title: "Permission-gated agent",
    body: "Every edit, shell command, search, and git operation passes an allow/deny engine — approvals persist across restarts.",
  },
  {
    icon: "computer",
    title: "Real desktop IDE",
    body: "Monaco editor, file tree, git panel, integrated terminal, live preview, and a code map — panels that resize and remember.",
  },
  {
    icon: "home",
    title: "Local-first by design",
    body: "The gateway endpoint, ports, and data directory are the only configuration. Keys are masked in logs and never leave your machine.",
  },
  {
    icon: "cpu",
    title: "Bring your own models",
    body: "Works with any OpenAI-compatible gateway, including the self-hosted OmniRoute — local or cloud, you choose the models.",
  },
  {
    icon: "sparkles",
    title: "Setup that actually tests",
    body: "The first-run wizard probes your data directory, makes a real gateway call, and shows a per-item pass/fail checklist.",
  },
  {
    icon: "bookOpen",
    title: "Optional project memory",
    body: "Add PostgreSQL for task history, usage dashboards, and project memory — or skip it, everything else still works.",
  },
];

const steps = [
  {
    title: "Download the installer",
    body: "Grab Aether-Setup-latest.exe — the download button always points at the newest release.",
  },
  {
    title: "Run it",
    body: "Per-user install to %LOCALAPPDATA%\\Programs\\Aether — no admin rights needed, with desktop and Start Menu shortcuts.",
  },
  {
    title: "Approve the SmartScreen prompt",
    body: "Builds are unsigned during development. Choose More info → Run anyway to continue.",
  },
  {
    title: "Complete the first-run wizard",
    body: "Pick a data folder, connect a model gateway + API key, and optionally point at PostgreSQL — each item is verified with a real call.",
  },
];

/** Formats 1234 as "1.2k", 125000 as "125k" — for compact display. */
function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

const faqs = [
  {
    question: "Why does Windows show a SmartScreen warning?",
    answer: (
      <>
        Installer builds are unsigned during development, so SmartScreen asks
        for confirmation on first run. Click <Text as="span" variant="code-default-xs">More info</Text> then{" "}
        <Text as="span" variant="code-default-xs">Run anyway</Text> to continue.
        Code signing is planned — see the installer docs on GitHub for the
        current status.
      </>
    ),
  },
  {
    question: "Do I need a model gateway, and how do I set one up?",
    answer: (
      <>
        Only for the AI/agent features. Aether works with any OpenAI-compatible
        gateway — it ships with support for self-hosted OmniRoute — and your
        code and API keys never leave your machine. The first-run wizard walks
        you through the endpoint and key and verifies both with a real call;
        you can change them any time under Settings. Without a reachable
        gateway the IDE still runs, but the agent shows as disconnected.
      </>
    ),
  },
  {
    question: "Where does Aether store my data?",
    answer: (
      <>
        Never in the install directory. Your settings, keys, and project data
        live in <Text as="span" variant="code-default-xs">%APPDATA%\Aether</Text>,
        relocatable with the <Text as="span" variant="code-default-xs">AETHER_HOME</Text>{" "}
        environment variable. The uninstaller asks before touching that folder
        — it never deletes your data silently.
      </>
    ),
  },
];

function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <Card
      fillWidth
      direction="column"
      gap="12"
      padding="20"
      border="neutral-alpha-weak"
      background="surface"
      radius="l"
    >
      <Row gap="12" vertical="center">
        <Icon name={icon} size="m" onBackground="brand-medium" />
        <Text variant="label-strong-m">{title}</Text>
      </Row>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {body}
      </Text>
    </Card>
  );
}

function DownloadButton({ release }: { release: ReleaseInfo }) {
  const href = release.latestDownloadUrl;
  const size = release.installer?.size ? formatBytes(release.installer.size) : "";

  return (
    <Button
      href={href}
      target="_blank"
      variant="primary"
      size="m"
      prefixIcon="download"
      arrowIcon
    >
      Download for Windows
      {size && ` · ${size}`}
    </Button>
  );
}

function VerifyDownload({ release }: { release: ReleaseInfo }) {
  if (!release.sha256Digest) return null;

  const certutilCommand = `certutil -hashfile ${release.installer?.name ?? LATEST_INSTALLER_NAME} SHA256`;

  return (
    <Card
      fillWidth
      direction="column"
      gap="12"
      padding="16"
      border="neutral-alpha-weak"
      background="surface"
      radius="l"
    >
      <Row gap="8" vertical="center" wrap horizontal="center">
        <Icon name="shield" size="s" onBackground="brand-medium" />
        <Text variant="label-strong-s">Verify the download (SHA-256)</Text>
      </Row>
      <Row gap="8" vertical="center" fillWidth>
        <Text
          variant="code-default-xs"
          onBackground="neutral-weak"
          style={{
            fontFamily: "monospace",
            wordBreak: "break-all",
            flex: 1,
          }}
        >
          {release.sha256Digest}
        </Text>
        <CopyButton value={release.sha256Digest} tooltip="Copy hash" />
      </Row>
      <Column
        gap="8"
        padding="12"
        background="neutral-alpha-weak"
        radius="m"
        fillWidth
      >
        <Text variant="label-default-xs" onBackground="neutral-weak">
          After downloading, run in PowerShell or Command Prompt:
        </Text>
        <Row gap="8" vertical="center" fillWidth>
          <Text
            variant="code-default-xs"
            style={{ fontFamily: "monospace", wordBreak: "break-all", flex: 1 }}
          >
            {certutilCommand}
          </Text>
          <CopyButton value={certutilCommand} tooltip="Copy command" />
        </Row>
      </Column>
      <Row gap="16" wrap horizontal="center">
        {release.sha256 && (
          <SmartLink href={release.sha256.url} target="_blank">
            <Text variant="label-default-xs">.sha256 file</Text>
          </SmartLink>
        )}
        <SmartLink href={release.htmlUrl} target="_blank">
          <Text variant="label-default-xs">Release on GitHub</Text>
        </SmartLink>
      </Row>
    </Card>
  );
}

function ReleaseNotes({ release }: { release: ReleaseInfo }) {
  if (release.sections.length === 0) return null;

  return (
    <Column fillWidth gap="16">
      <Heading as="h2" variant="heading-strong-l">
        What&rsquo;s new in {release.tagName}
      </Heading>
      <Card
        fillWidth
        direction="column"
        gap="16"
        padding="l"
        border="neutral-alpha-weak"
        background="surface"
        radius="l"
      >
        {release.sections.map((section, index) => (
          <Column key={index} gap="8" fillWidth>
            {section.label && (
              <Text variant="label-strong-s" onBackground="brand-medium">
                {section.label}
              </Text>
            )}
            {section.text && (
              <Text variant="body-default-m" onBackground="neutral-weak">
                {section.text}
              </Text>
            )}
            {section.bullets.length > 0 && (
              <Column as="ul" gap="4" paddingX="4">
                {section.bullets.map((bullet, bulletIndex) => (
                  <Row key={bulletIndex} gap="8" vertical="center">
                    <Text variant="body-default-s" onBackground="brand-medium">
                      –
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {bullet}
                    </Text>
                  </Row>
                ))}
              </Column>
            )}
          </Column>
        ))}
        <SmartLink href={release.htmlUrl} target="_blank" suffixIcon="arrowUpRightFromSquare">
          <Text variant="label-default-m">Full release notes on GitHub</Text>
        </SmartLink>
      </Card>
    </Column>
  );
}

export async function generateMetadata() {
  const release = await loadRelease();

  return Meta.generate({
    title: "Download Aether – local-first AI development environment",
    description: release
      ? `Download Aether ${release.tagName} for Windows: a desktop IDE with a built-in, permission-gated autonomous coding agent. Local-first — your code and API keys never leave your machine.`
      : "Download Aether for Windows: a desktop IDE with a built-in, permission-gated autonomous coding agent. Local-first — your code and API keys never leave your machine.",
    baseURL: baseURL,
    image: "/resources/aether/aether-icon.png",
    path: "/work/aether/download",
  });
}

export default async function AetherDownload() {
  const release = await loadRelease();

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/aether/download"
        title="Download Aether"
        description="A local-first AI development environment: a desktop IDE with a built-in, permission-gated autonomous coding agent."
        image="/resources/aether/aether-icon.png"
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column maxWidth="s" horizontal="center" align="center" gap="16">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Column maxWidth="16">
          <Media
            src="/resources/aether/aether-icon.png"
            alt="Aether app icon"
            aspectRatio="1"
            radius="l"
          />
        </Column>
        <Heading variant="display-strong-m" wrap="balance">
          Aether
        </Heading>
        <Text
          variant="body-default-m"
          onBackground="neutral-weak"
          align="center"
          wrap="balance"
        >
          A local-first AI development environment — a desktop IDE with a built-in,
          permission-gated autonomous coding agent. Your code and API keys never
          leave your machine.
        </Text>
        <Row gap="8" wrap horizontal="center">
          <Tag variant="brand" prefixIcon="download">
            {release.tagName} latest
          </Tag>
          {release.totalDownloads > 0 && (
            <Tag variant="neutral" prefixIcon="download">
              {formatCount(release.totalDownloads)} downloads
            </Tag>
          )}
          {release?.publishedAt && (
            <Tag variant="neutral">
              Released {formatDate(release.publishedAt, true)}
            </Tag>
          )}
          {release?.prerelease && <Tag variant="warning">Pre-release</Tag>}
          <Tag variant="neutral" prefixIcon="windows">
            Windows 10 / 11
          </Tag>
          <Tag variant="neutral" prefixIcon="shield">
            Local-first
          </Tag>
        </Row>
        <Row gap="12" wrap horizontal="center" paddingTop="8">
          <DownloadButton release={release} />
          <Button
            href={REPO}
            target="_blank"
            variant="secondary"
            size="m"
            prefixIcon="github"
          >
            View on GitHub
          </Button>
        </Row>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          {release.installer?.name ?? LATEST_INSTALLER_NAME}
        </Text>
        <VerifyDownload release={release} />
      </Column>

      <ReleaseNotes release={release} />

      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-l">
          System requirements
        </Heading>
        <Row gap="8" wrap>
          <Tag variant="neutral" prefixIcon="windows">
            Windows 10 or 11 (64-bit)
          </Tag>
          <Tag variant="neutral" prefixIcon="download">
            No Node.js required — runtime is bundled
          </Tag>
          <Tag variant="neutral" prefixIcon="computer">
            Per-user install, no admin needed
          </Tag>
          <Tag variant="neutral" prefixIcon="cpu">
            Model gateway required for AI features
          </Tag>
        </Row>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Requires a running OpenAI-compatible model gateway — self-hosted
          OmniRoute, or any compatible API plus key — for the AI/agent features
          to function. The IDE itself runs fine without one, but the agent will
          show as disconnected until a gateway is reachable.
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Your data never lives in the install directory: it stays in{" "}
          <Text as="span" variant="code-default-s">
            %APPDATA%\Aether
          </Text>{" "}
          (override with <Text as="span" variant="code-default-s">AETHER_HOME</Text>),
          and the uninstaller asks before touching it — never deletes silently.
        </Text>
      </Column>

      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-l">
          What you get
        </Heading>
        <Grid columns="3" s={{ columns: 1 }} fillWidth gap="12">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Grid>
      </Column>

      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-l">
          Install in four steps
        </Heading>
        <Column fillWidth gap="12">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              fillWidth
              direction="row"
              gap="16"
              padding="16"
              border="neutral-alpha-weak"
              background="surface"
              radius="l"
              vertical="center"
            >
              <Row
                width="40"
                height="40"
                horizontal="center"
                vertical="center"
                background="brand-alpha-weak"
                radius="m"
                fitHeight
              >
                <Text variant="label-strong-m" onBackground="brand-medium">
                  {index + 1}
                </Text>
              </Row>
              <Column gap="4">
                <Text variant="label-strong-m">{step.title}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {step.body}
                </Text>
              </Column>
            </Card>
          ))}
        </Column>
      </Column>

      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-l">
          Frequently asked questions
        </Heading>
        <AccordionGroup items={faqs.map(({ question, answer }) => ({
          title: question,
          content: (
            <Text variant="body-default-s" onBackground="neutral-weak">
              {answer}
            </Text>
          ),
        }))}
          fillWidth
          size="m"
          autoCollapse
        />
      </Column>

      <Column fillWidth gap="40" horizontal="center" marginTop="24">
        <Line maxWidth="40" />
        <Row gap="24" wrap horizontal="center">
          <SmartLink href="/work">
            <Text variant="label-strong-m">All projects</Text>
          </SmartLink>
          <SmartLink href={REPO} target="_blank" suffixIcon="arrowUpRightFromSquare">
            <Text variant="label-default-m">GitHub repository</Text>
          </SmartLink>
          <SmartLink href={release?.releasesListUrl ?? RELEASES_LIST_URL} target="_blank">
            <Text variant="label-default-m">All releases</Text>
          </SmartLink>
        </Row>
      </Column>
    </Column>
  );
}
