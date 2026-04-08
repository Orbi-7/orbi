/**
 * Strips markdown asterisks from text for cleaner display.
 * Converts **bold** to bold, * bullets to • bullets, removes remaining *
 */
export function stripMarkdownAsterisks(text: string): string {
  if (!text || typeof text !== "string") return text;
  return (
    text
      // **bold text** -> bold text
      .replace(/\*\*([^*]*)\*\*/g, "$1")
      // * italic * or *list item* - replace * at line start with bullet
      .replace(/^\*\s+/gm, "• ")
      .replace(/\n\*\s+/g, "\n• ")
      // *italic* (single asterisks around text) -> text
      .replace(/\*([^*]+)\*/g, "$1")
      // Remove any remaining asterisks
      .replace(/\*/g, "")
      // Replace --- horizontal rules with empty line (avoid stray lines)
      .replace(/^---+$/gm, "")
      .trim()
  );
}
