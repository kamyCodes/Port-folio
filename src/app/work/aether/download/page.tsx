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

async function loadRelease(): Promise<ReleaseInfo> {
  return (await getLatestRelease()) ?? FALLBACK_RELEASE;
}

const REPO = "https://github.com/kamyCodes/Aether";

/** Formats 1234 as "1.2k", 125000 as "125k" — for compact display. */
function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

const features = [
  {
    icon: "shield",
    title: "Permission-Gated Agent",
    body: "Every edit, shell command, search, and git operation passes an allow/deny engine — approvals persist across restarts.",
  },
  {
    icon: "computer",
    title: "Real Desktop IDE",
    body: "Monaco editor, file tree, git panel, integrated terminal, live preview, and code map with customizable, resizable layouts.",
  },
  {
    icon: "home",
    title: "Local-First by Design",
    body: "Gateway endpoints, ports, and data directory are the only configuration. Keys are masked in logs and stay local.",
  },
  {
    icon: "cpu",
    title: "Bring Your Own Models",
    body: "Works with any OpenAI-compatible gateway (OmniRoute, Ollama, LM Studio, etc.) — local or cloud, you choose.",
  },
  {
    icon: "sparkles",
    title: "Self-Verifying Wizard",
    body: "First-run setup tests data folders, verifies gateway connectivity, and validates model endpoints in real time.",
  },
  {
    icon: "bookOpen",
    title: "Optional Project Memory",
    body: "Plug in PostgreSQL for full task history, usage analytics, and persistent project memory — or run without it.",
  },
];

const steps = [
  {
    step: "01",
    title: "Download Installer",
    body: "Get Aether-Setup-latest.exe directly from the latest official GitHub release.",
  },
  {
    step: "02",
    title: "Run Setup",
    body: "Per-user installation to %LOCALAPPDATA%\\Programs\\Aether — no administrator privileges required.",
  },
  {
    step: "03",
    title: "Pass SmartScreen",
    body: "During development builds, click 'More info' → 'Run anyway' to launch the unsigned installer.",
  },
  {
    step: "04",
    title: "First-Run Setup",
    body: "Pick a data folder, connect your OpenAI-compatible model gateway, and test connection live.",
  },
];

const faqs = [
  {
    question: "Why does Windows show a SmartScreen warning?",
    answer: (
      <>
        Installer builds are unsigned during active development, so Windows SmartScreen displays a warning on first run. Click <Text as="span" variant="code-default-xs">More info</Text> then{" "}
        <Text as="span" variant="code-default-xs">Run anyway</Text> to proceed safely. Code signing will be added in upcoming stable builds.
      </>
    ),
  },
  {
    question: "Do I need a model gateway, and how do I set one up?",
    answer: (
      <>
        A model gateway is required for autonomous AI coding features. Aether supports any OpenAI-compatible endpoint (including self-hosted OmniRoute, LocalAI, or cloud APIs). Your code and API keys remain local on your device.
      </>
    ),
  },
  {
    question: "Where does Aether store my configuration and data?",
    answer: (
      <>
        Your settings and workspace state live in <Text as="span" variant="code-default-xs">%APPDATA%\Aether</Text> (configurable via <Text as="span" variant="code-default-xs">AETHER_HOME</Text>). Uninstalling will prompt before removing user data.
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
      padding="24"
      border="neutral-alpha-weak"
      background="surface"
      radius="l-4"
    >
      <Row gap="12" vertical="center">
        <Row
          width="40"
          height="40"
          horizontal="center"
          vertical="center"
          background="brand-alpha-weak"
          radius="m"
        >
          <Icon name={icon} size="m" onBackground="brand-medium" />
        </Row>
        <Text variant="heading-strong-s">{title}</Text>
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
      size="l"
      prefixIcon="download"
      arrowIcon
    >
      Download for Windows
      {size && ` (${size})`}
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
      gap="16"
      padding="20"
      border="neutral-alpha-weak"
      background="surface"
      radius="l-4"
    >
      <Row gap="8" vertical="center" horizontal="between" fillWidth wrap>
        <Row gap="8" vertical="center">
          <Icon name="shield" size="s" onBackground="brand-medium" />
          <Text variant="label-strong-s">Verify Download Hash (SHA-256)</Text>
        </Row>
        <Row gap="12" vertical="center">
          {release.sha256 && (
            <SmartLink href={release.sha256.url} target="_blank">
              <Text variant="label-default-xs">.sha256 file</Text>
            </SmartLink>
          )}
          <SmartLink href={release.htmlUrl} target="_blank">
            <Text variant="label-default-xs">Release on GitHub</Text>
          </SmartLink>
        </Row>
      </Row>

      <Column
        gap="8"
        padding="12"
        background="neutral-alpha-weak"
        radius="m"
        fillWidth
      >
        <Text variant="label-default-xs" onBackground="neutral-weak">
          Checksum Digest:
        </Text>
        <Row gap="8" vertical="center" fillWidth>
          <Text
            variant="code-default-xs"
            onBackground="neutral-medium"
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
      </Column>

      <Column
        gap="8"
        padding="12"
        background="neutral-alpha-weak"
        radius="m"
        fillWidth
      >
        <Text variant="label-default-xs" onBackground="neutral-weak">
          PowerShell / CMD Verification Command:
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
    </Card>
  );
}

function ReleaseNotes({ release }: { release: ReleaseInfo }) {
  if (release.sections.length === 0) return null;

  return (
    <Column fillWidth gap="16">
      <Row gap="8" vertical="center">
        <Icon name="sparkles" size="m" onBackground="brand-medium" />
        <Heading as="h2" variant="heading-strong-l">
          What's New in {release.tagName}
        </Heading>
      </Row>
      <Card
        fillWidth
        direction="column"
        gap="16"
        padding="24"
        border="neutral-alpha-weak"
        background="surface"
        radius="l-4"
      >
        {release.sections.map((section, index) => (
          <Column key={index} gap="8" fillWidth>
            {section.label && (
              <Text variant="label-strong-m" onBackground="brand-medium">
                {section.label}
              </Text>
            )}
            {section.text && (
              <Text variant="body-default-m" onBackground="neutral-weak">
                {section.text}
              </Text>
            )}
            {section.bullets.length > 0 && (
              <Column as="ul" gap="8" paddingX="4">
                {section.bullets.map((bullet, bulletIndex) => (
                  <Row key={bulletIndex} gap="8" vertical="center">
                    <Text variant="body-default-s" onBackground="brand-medium">
                      •
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
        <Line border="neutral-alpha-weak" />
        <SmartLink href={release.htmlUrl} target="_blank" suffixIcon="arrowUpRightFromSquare">
          <Text variant="label-strong-m">View full changelog on GitHub</Text>
        </SmartLink>
      </Card>
    </Column>
  );
}

export async function generateMetadata() {
  const release = await loadRelease();

  return Meta.generate({
    title: "Download Aether – Local-First AI Development Environment",
    description: release
      ? `Download Aether ${release.tagName} for Windows: Desktop IDE with a built-in autonomous AI coding agent. Local-first architecture.`
      : "Download Aether for Windows: Desktop IDE with a built-in autonomous AI coding agent.",
    baseURL: baseURL,
    image: "/resources/aether/aether-icon.png",
    path: "/work/aether/download",
  });
}

export default async function AetherDownload() {
  const release = await loadRelease();

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="40" paddingTop="32" paddingBottom="48">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/aether/download"
        title="Download Aether Desktop IDE"
        description="A local-first AI development environment — desktop IDE with permission-gated autonomous coding agent."
        image="/resources/aether/aether-icon.png"
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero Header Card */}
      <Card
        fillWidth
        direction="column"
        horizontal="center"
        align="center"
        gap="20"
        padding="32"
        border="brand-alpha-medium"
        background="surface"
        radius="l-4"
        style={{
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Row gap="8" vertical="center">
          <SmartLink href="/work">
            <Text variant="label-strong-s">← Projects</Text>
          </SmartLink>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            /
          </Text>
          <Text variant="label-default-xs" onBackground="brand-medium">
            Aether IDE
          </Text>
        </Row>

        <Column maxWidth="12">
          <Media
            src="/resources/aether/aether-icon.png"
            alt="Aether app icon"
            aspectRatio="1"
            radius="l"
          />
        </Column>

        <Column gap="8" horizontal="center" align="center">
          <Heading variant="display-strong-l" wrap="balance" align="center">
            Aether AI Desktop IDE
          </Heading>
          <Column maxWidth="s">
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              align="center"
              wrap="balance"
            >
              A local-first development environment featuring a permission-gated autonomous coding agent. Your code and API keys never leave your device.
            </Text>
          </Column>
        </Column>

        <Row gap="8" wrap horizontal="center">
          <Tag variant="brand" prefixIcon="download">
            {release.tagName}
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
          <Tag variant="neutral" prefixIcon="windows">
            Windows 10 / 11 (64-bit)
          </Tag>
          <Tag variant="neutral" prefixIcon="shield">
            Local-First Security
          </Tag>
        </Row>

        <Row gap="16" wrap horizontal="center" paddingTop="12">
          <DownloadButton release={release} />
          <Button
            href={REPO}
            target="_blank"
            variant="secondary"
            size="l"
            prefixIcon="github"
          >
            GitHub Repository
          </Button>
        </Row>

        <Text variant="body-default-xs" onBackground="neutral-weak">
          Package: {release.installer?.name ?? LATEST_INSTALLER_NAME}
        </Text>
      </Card>

      {/* Verify Download Card */}
      <VerifyDownload release={release} />

      {/* Release Notes */}
      <ReleaseNotes release={release} />

      {/* Features Grid */}
      <Column fillWidth gap="20">
        <Row gap="8" vertical="center">
          <Icon name="sparkles" size="m" onBackground="brand-medium" />
          <Heading as="h2" variant="heading-strong-l">
            Key Features & Capabilities
          </Heading>
        </Row>
        <Grid columns="3" s={{ columns: 1 }} fillWidth gap="16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Grid>
      </Column>

      {/* Installation Steps */}
      <Column fillWidth gap="20">
        <Row gap="8" vertical="center">
          <Icon name="computer" size="m" onBackground="brand-medium" />
          <Heading as="h2" variant="heading-strong-l">
            Quick Installation (4 Steps)
          </Heading>
        </Row>
        <Grid columns="2" s={{ columns: 1 }} fillWidth gap="16">
          {steps.map((step) => (
            <Card
              key={step.title}
              fillWidth
              direction="row"
              gap="16"
              padding="20"
              border="neutral-alpha-weak"
              background="surface"
              radius="l-4"
              vertical="center"
            >
              <Row
                horizontal="center"
                vertical="center"
                background="brand-alpha-medium"
                radius="l"
                style={{ width: 44, height: 44, minWidth: 44 }}
              >
                <Text variant="label-strong-l" onBackground="brand-medium">
                  {step.step}
                </Text>
              </Row>
              <Column gap="4">
                <Text variant="heading-strong-s">{step.title}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {step.body}
                </Text>
              </Column>
            </Card>
          ))}
        </Grid>
      </Column>

      {/* System Requirements */}
      <Card
        fillWidth
        direction="column"
        gap="16"
        padding="24"
        border="neutral-alpha-weak"
        background="surface"
        radius="l-4"
      >
        <Row gap="8" vertical="center">
          <Icon name="cpu" size="m" onBackground="brand-medium" />
          <Heading as="h2" variant="heading-strong-l">
            System & Gateway Requirements
          </Heading>
        </Row>
        <Row gap="8" wrap>
          <Tag variant="neutral" prefixIcon="windows">
            Windows 10 / 11 (64-bit)
          </Tag>
          <Tag variant="neutral" prefixIcon="download">
            Zero External Runtimes (Bundled)
          </Tag>
          <Tag variant="neutral" prefixIcon="computer">
            Per-User Setup (No Admin Rights)
          </Tag>
          <Tag variant="neutral" prefixIcon="cpu">
            OpenAI-Compatible Gateway
          </Tag>
        </Row>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Requires an OpenAI-compatible model gateway (such as self-hosted OmniRoute, LocalAI, Ollama, or cloud endpoint) for autonomous agent execution. The IDE functions offline as a standalone code editor without a gateway connected.
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Application data and workspace settings reside in <Text as="span" variant="code-default-s">%APPDATA%\Aether</Text> (customizable via <Text as="span" variant="code-default-s">AETHER_HOME</Text>).
        </Text>
      </Card>

      {/* Frequently Asked Questions */}
      <Column fillWidth gap="20">
        <Row gap="8" vertical="center">
          <Icon name="help" size="m" onBackground="brand-medium" />
          <Heading as="h2" variant="heading-strong-l">
            Frequently Asked Questions
          </Heading>
        </Row>
        <AccordionGroup
          items={faqs.map(({ question, answer }) => ({
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

      {/* Footer Navigation */}
      <Column fillWidth gap="24" horizontal="center" marginTop="16">
        <Line fillWidth border="neutral-alpha-weak" />
        <Row gap="24" wrap horizontal="center">
          <SmartLink href="/work">
            <Text variant="label-strong-m">← All Projects</Text>
          </SmartLink>
          <SmartLink href={REPO} target="_blank" suffixIcon="arrowUpRightFromSquare">
            <Text variant="label-default-m">GitHub Repository</Text>
          </SmartLink>
          <SmartLink href={release?.releasesListUrl ?? RELEASES_LIST_URL} target="_blank">
            <Text variant="label-default-m">All Releases</Text>
          </SmartLink>
        </Row>
      </Column>
    </Column>
  );
}
