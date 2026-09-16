import {
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

const REPO = "https://github.com/kamyCodes/Aether";
const RELEASES = `${REPO}/releases/latest`;

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
    body: "Grab the latest Aether-Setup-<version>.exe from GitHub Releases.",
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

const sourceCommands = [
  "git clone https://github.com/kamyCodes/Aether.git",
  "cd Aether",
  "npm install",
  "npm run dev",
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

export async function generateMetadata() {
  return Meta.generate({
    title: "Download Aether – local-first AI development environment",
    description:
      "Download Aether for Windows: a desktop IDE with a built-in, permission-gated autonomous coding agent. Local-first — your code and API keys never leave your machine.",
    baseURL: baseURL,
    image: "/resources/aether/aether-icon.png",
    path: "/work/aether/download",
  });
}

export default function AetherDownload() {
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
          <Tag variant="neutral" prefixIcon="windows">
            Windows 10 / 11
          </Tag>
          <Tag variant="neutral" prefixIcon="download">
            Free installer
          </Tag>
          <Tag variant="neutral" prefixIcon="shield">
            Local-first
          </Tag>
        </Row>
        <Row gap="12" wrap horizontal="center" paddingTop="8">
          <Button
            href={RELEASES}
            target="_blank"
            variant="primary"
            size="m"
            prefixIcon="download"
            suffixIcon="arrowUpRightFromSquare"
          >
            Download for Windows
          </Button>
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
      </Column>

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
        </Row>
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

      <Card
        fillWidth
        direction="column"
        gap="16"
        padding="l"
        border="neutral-alpha-weak"
        background="surface"
        radius="l"
      >
        <Row gap="12" vertical="center" wrap>
          <Icon name="terminal" size="m" onBackground="brand-medium" />
          <Heading as="h3" variant="heading-strong-m">
            Run from source
          </Heading>
          <Tag variant="neutral">Node.js 22+</Tag>
        </Row>
        <Column
          gap="8"
          padding="16"
          background="neutral-alpha-weak"
          border="neutral-alpha-weak"
          radius="m"
        >
          {sourceCommands.map((command) => (
            <Text
              key={command}
              variant="label-default-m"
              style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
            >
              {command}
            </Text>
          ))}
        </Column>
        <Text variant="body-default-s" onBackground="neutral-weak">
          <Text as="span" variant="code-default-s">
            npm run dev
          </Text>{" "}
          starts the API server and the Vite dev server together; the UI opens on
          the Vite port. Ports and hosts come from the server config (override
          with PORT / HOST).
        </Text>
      </Card>

      <Column fillWidth gap="40" horizontal="center" marginTop="24">
        <Line maxWidth="40" />
        <Row gap="24" wrap horizontal="center">
          <SmartLink href="/work">
            <Text variant="label-strong-m">All projects</Text>
          </SmartLink>
          <SmartLink href={REPO} target="_blank" suffixIcon="arrowUpRightFromSquare">
            <Text variant="label-default-m">GitHub repository</Text>
          </SmartLink>
          <SmartLink href="/work/aether">
            <Text variant="label-default-m">About Aether</Text>
          </SmartLink>
        </Row>
      </Column>
    </Column>
  );
}
