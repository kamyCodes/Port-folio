import { cache } from "react";

const REPO_API = "https://api.github.com/repos/kamyCodes/Aether";
const RELEASES_DOWNLOAD_BASE = "https://github.com/kamyCodes/Aether/releases";
const ONE_HOUR = 3600;

export interface ReleaseAsset {
  name: string;
  size: number;
  downloadCount: number;
  url: string;
}

export interface ReleaseSection {
  label: string;
  text: string;
  bullets: string[];
}

export interface ReleaseInfo {
  tagName: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  prerelease: boolean;
  installer: ReleaseAsset | null;
  sha256: ReleaseAsset | null;
  /** Hex digest parsed from the .sha256 asset (empty when unavailable). */
  sha256Digest: string;
  /** Parsed release-note sections. */
  sections: ReleaseSection[];
  /** Total asset download counts summed across every published release. */
  totalDownloads: number;
  /** Stable permalink that always resolves to the newest release's installer asset. */
  latestDownloadUrl: string;
  /** All-releases listing on GitHub. */
  releasesListUrl: string;
}

export const RELEASES_URL = "https://github.com/kamyCodes/Aether/releases/latest";
export const RELEASES_LIST_URL = "https://github.com/kamyCodes/Aether/releases";

/**
 * Fixed, version-less installer filename published on every release by
 * scripts/build-windows-installer.mjs (an identical byte-for-byte copy of the
 * versioned Aether-Setup-<version>.exe, plus its own .sha256 record).
 *
 * The download button points at the /releases/latest/download/ URL for this
 * name, which never changes release to release — the website never needs a
 * version bump again.
 */
export const LATEST_INSTALLER_NAME = "Aether-Setup-latest.exe";
export const LATEST_CHECKSUM_NAME = `${LATEST_INSTALLER_NAME}.sha256`;
export const LATEST_DOWNLOAD_URL = `${RELEASES_DOWNLOAD_BASE}/latest/download/${LATEST_INSTALLER_NAME}`;

/**
 * Fetch release data for Aether from a single ``/releases`` listing call:
 * the latest stable release plus total asset downloads across all releases.
 * Returns null when the API is unreachable, rate-limited, or has no releases
 * so callers can fall back to static links instead of failing the page.
 *
 * Cached for an hour via fetch-level revalidation (also deduped per request).
 */
async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "kamy-portfolio",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    // Optional: raised rate limits when GITHUB_TOKEN is set in the environment.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${REPO_API}/releases?per_page=100`, {
      headers,
      next: { revalidate: ONE_HOUR },
    });

    if (!res.ok) return null;

    const data: any = await res.json();
    const releases: any[] = Array.isArray(data) ? data : [];
    if (releases.length === 0) return null;

    // /releases sorts newest first. Match /releases/latest semantics:
    // the newest release that is neither a draft nor a pre-release.
    const latest =
      releases.find((release) => !release?.draft && !release?.prerelease) ??
      releases.find((release) => !release?.draft);
    if (!latest || !latest.tag_name) return null;

    // Sum download counts across every asset of every published release.
    const totalDownloads = releases.reduce(
      (sum, release) =>
        sum +
        (Array.isArray(release?.assets)
          ? release.assets.reduce(
              (assetSum: number, asset: any) => assetSum + (asset?.download_count ?? 0),
              0,
            )
          : 0),
      0,
    );

    const assets: any[] = Array.isArray(latest.assets) ? latest.assets : [];
    // Prefer the fixed-name "latest" copy; fall back to the versioned installer
    // for releases published before the latest-named copy existed.
    const installerAsset =
      assets.find((asset) => (asset?.name ?? "") === LATEST_INSTALLER_NAME) ??
      assets.find((asset) => /\.(exe|msi|zip)$/i.test(asset?.name ?? ""));
    const sha256Asset =
      assets.find((asset) => (asset?.name ?? "") === LATEST_CHECKSUM_NAME) ??
      assets.find((asset) => /\.sha256$/i.test(asset?.name ?? ""));

    const sha256Digest = sha256Asset?.browser_download_url
      ? await fetchSha256Digest(sha256Asset.browser_download_url)
      : "";

    return {
      // Read off `latest` (the chosen release object), not `data` (the array).
      tagName: latest.tag_name,
      name: typeof latest.name === "string" && latest.name.trim() ? latest.name : latest.tag_name,
      publishedAt: latest.published_at ?? "",
      htmlUrl: latest.html_url ?? RELEASES_URL,
      prerelease: Boolean(latest.prerelease),
      installer: installerAsset
        ? {
            name: installerAsset.name,
            size: installerAsset.size ?? 0,
            downloadCount: installerAsset.download_count ?? 0,
            url: installerAsset.browser_download_url,
          }
        : null,
      sha256: sha256Asset
        ? {
            name: sha256Asset.name,
            size: sha256Asset.size ?? 0,
            downloadCount: sha256Asset.download_count ?? 0,
            url: sha256Asset.browser_download_url,
          }
        : null,
      sections: parseReleaseNotes(latest.body),
      totalDownloads,
      sha256Digest,
      // Static permalink — always the fixed latest-named asset, never a
      // version-dependent filename.
      latestDownloadUrl: installerAsset ? LATEST_DOWNLOAD_URL : RELEASES_URL,
      releasesListUrl: RELEASES_LIST_URL,
    };
  } catch {
    return null;
  }
}

/**
 * Download a .sha256 asset (a small text file like "<hex>  <filename>") and
 * extract the 64-character digest. Best-effort: returns "" on any failure.
 */
async function fetchSha256Digest(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "kamy-portfolio" },
      next: { revalidate: ONE_HOUR },
    });
    if (!res.ok) return "";
    const text = await res.text();
    return text.match(/\b[a-fA-F0-9]{64}\b/)?.[0] ?? "";
  } catch {
    return "";
  }
}

/** Request-level dedupe on top of the revalidate cache. */
export const getLatestRelease = cache(fetchLatestRelease);

/**
 * Hardcoded baseline shown when the GitHub API is unreachable (rate limit,
 * outage, network failure) — never blank text, "undefined", or a spinner.
 *
 * Mirrors the current published release (v0.1.1); update alongside each
 * release if you want the worst-case fallback text to track reality. The
 * download URL is the fixed latest-named asset, which stays valid regardless.
 */
export const FALLBACK_RELEASE: ReleaseInfo = {
  tagName: "v0.1.1",
  name: "Aether v0.1.1",
  publishedAt: "2026-09-17T12:18:44Z",
  htmlUrl: RELEASES_URL,
  prerelease: false,
  installer: {
    name: LATEST_INSTALLER_NAME,
    size: 0,
    downloadCount: 0,
    url: LATEST_DOWNLOAD_URL,
  },
  sha256: {
    name: LATEST_CHECKSUM_NAME,
    size: 0,
    downloadCount: 0,
    url: `${RELEASES_DOWNLOAD_BASE}/latest/download/${LATEST_CHECKSUM_NAME}`,
  },
  sha256Digest:
    "441e4e4cf5e9e9f74f08c78cf134575fb38c832c8ad16f46c6940367da23b953",
  sections: parseReleaseNotes(
    "Sessions survive restarts\n\nChat threads persist per workspace — conversations are mirrored to disk (atomic, debounced writes) and restored on boot. Closing the app no longer loses your threads, active chat, or task bindings.\n\nTerminal tabs come back after a restart — titles, working directories, and workspace scoping persist; shells respawn fresh with scrollback restored from the client's replay cache.\n\nNo more restart ghosts — any task that was running, planning, or queued when the backend died is marked failed on boot before anything restores from disk, so a dead task can never come back looking alive.\n\nNew confirm modal for destructive actions\n\nReworked settings modal, terminal panel (command history with exit codes and output tails), composer, agent chat, and status bar\nBrand mark and welcome-screen polish; expanded glass design tokens",
  ),
  totalDownloads: 0,
  latestDownloadUrl: LATEST_DOWNLOAD_URL,
  releasesListUrl: RELEASES_LIST_URL,
};

/**
 * Remove inline markdown that would otherwise show up as raw symbols in the
 * rendered release notes: `**bold**`, `__bold__`, `*italic*`, and `` `code` ``.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1$2");
}

/**
 * Parse release-note text into display sections. Splits on blank lines, pulls
 * out bullet lists, strips common "Label:" lead-ins (e.g. "What's new in
 * 0.1.0:", "System requirements:") into a `label`, and strips all markdown
 * formatting — headings ("### Fixed"), bold ("**text**"), and inline code —
 * so no raw markdown symbols ever reach the page. A markdown heading becomes
 * the section's label (carried forward when the heading stands alone in its
 * own paragraph); "Full Changelog" compare links are dropped.
 */
export function parseReleaseNotes(body: string | null | undefined): ReleaseSection[] {
  if (!body) return [];

  const paragraphs = body
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const sections: ReleaseSection[] = [];
  let pendingHeading = "";

  for (const paragraph of paragraphs) {
    const lines: string[] = [];
    let headingLabel = "";

    for (const raw of paragraph.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;

      // Horizontal rules (---, ***, ___) are pure decoration — drop them.
      if (/^([-*_])\1{2,}$/.test(line)) continue;

      const heading = line.match(/^#{1,6}\s+(.+)$/);
      if (heading) {
        headingLabel = stripInlineMarkdown(heading[1]).trim();
        continue;
      }

      // "**Full Changelog**: <compare url>" — GitHub's autogenerated footer.
      if (/^full changelog\b/i.test(stripInlineMarkdown(line))) continue;

      const cleaned = stripInlineMarkdown(line).trim();
      if (cleaned) lines.push(cleaned);
    }

    const bullets = lines
      .filter((line) => /^[-*•]\s+/.test(line))
      .map((line) => line.replace(/^[-*•]\s+/, ""));

    const text = lines
      .filter((line) => !/^[-*•]\s+/.test(line))
      .join(" ");

    const match = text.match(
      /^(What'?s new[^:]*|System requirements|Highlights?|Notes?|Changes?|Fixes?|Breaking changes)\s*:\s*/i,
    );
    const label = match ? match[1] : headingLabel || pendingHeading;
    const bodyText = match ? text.slice(match[0].length) : text;

    if (bodyText || bullets.length > 0) {
      sections.push({ label, text: bodyText, bullets });
      pendingHeading = "";
    } else if (headingLabel) {
      // Heading-only paragraph: carry the label forward to the next section
      // (a later heading replaces an earlier one, e.g. "## Release v0.1.2"
      // followed by "### Zero-config first run").
      pendingHeading = headingLabel;
    }
  }

  return sections;
}

/** Human-readable file size, e.g. 135501490 -> "129 MB". */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  if (mb >= 10) return `${Math.round(mb)} MB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
