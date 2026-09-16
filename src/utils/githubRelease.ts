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
    const installerAsset = assets.find((asset) => /\.(exe|msi|zip)$/i.test(asset?.name ?? ""));
    const sha256Asset = assets.find((asset) => /\.sha256$/i.test(asset?.name ?? ""));

    const sha256Digest = sha256Asset?.browser_download_url
      ? await fetchSha256Digest(sha256Asset.browser_download_url)
      : "";

    return {
      tagName: data.tag_name,
      name: typeof data.name === "string" && data.name.trim() ? data.name : data.tag_name,
      publishedAt: data.published_at ?? "",
      htmlUrl: data.html_url ?? RELEASES_URL,
      prerelease: Boolean(data.prerelease),
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
      latestDownloadUrl: installerAsset
        ? `${RELEASES_DOWNLOAD_BASE}/latest/download/${installerAsset.name}`
        : RELEASES_URL,
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
 * Parse release-note text into display sections. Splits on blank lines, pulls
 * out bullet lists, and strips common "Label:" lead-ins (e.g. "What's new in
 * 0.1.0:", "System requirements:") into a `label`.
 */
export function parseReleaseNotes(body: string | null | undefined): ReleaseSection[] {
  if (!body) return [];

  return body
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const lines = paragraph
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const bullets = lines
        .filter((line) => /^[-*•]\s+/.test(line))
        .map((line) => line.replace(/^[-*•]\s+/, ""));

      const text = lines
        .filter((line) => !/^[-*•]\s+/.test(line))
        .join(" ");

      const match = text.match(
        /^(What'?s new[^:]*|System requirements|Highlights?|Notes?|Changes?|Fixes?|Breaking changes)\s*:\s*/i,
      );
      const label = match ? match[1] : "";
      const bodyText = match ? text.slice(match[0].length) : text;

      return { label, text: bodyText, bullets };
    })
    .filter((section) => section.text || section.bullets.length > 0);
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
