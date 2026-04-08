/* High-res SVG logos - Simple Icons CDN + jsDelivr fallback for reliability */
const LOGO = (slug: string, color = "171717") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;
const JSDELIVR = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${slug}.svg`;

export const APPS = [
  { id: "googlecalendar", name: "Google Calendar", desc: "Events & availability", logo: LOGO("googlecalendar", "4285f4") },
  { id: "gmail", name: "Gmail", desc: "Emails & threads", logo: LOGO("gmail") },
  { id: "slack", name: "Slack", desc: "Channels & messages", logo: JSDELIVR("slack") },
  { id: "jira", name: "Jira", desc: "Issues & sprints", logo: LOGO("jira") },
  { id: "github", name: "GitHub", desc: "PRs & repos", logo: LOGO("github") },
  { id: "notion", name: "Notion", desc: "Notes & docs", logo: LOGO("notion") },
  { id: "linear", name: "Linear", desc: "Issues & cycles", logo: LOGO("linear") },
  { id: "asana", name: "Asana", desc: "Tasks & projects", logo: LOGO("asana") },
  { id: "googledrive", name: "Google Drive", desc: "Files & folders", logo: LOGO("googledrive") },
] as const;

export function getAppLogo(slugOrName: string): string | undefined {
  const key = slugOrName.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");
  return APPS.find(
    (a) =>
      a.id.toLowerCase().replace(/_/g, "") === key ||
      a.name.toLowerCase().replace(/\s+/g, "") === key
  )?.logo;
}
