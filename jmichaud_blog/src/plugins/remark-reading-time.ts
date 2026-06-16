import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import type { VFile } from "vfile";

export function remarkReadingTime() {
  return function (
    tree: Root,
    file: VFile & {
      data: { astro?: { frontmatter?: Record<string, unknown> } };
    }
  ) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};

    // Store as a number (minutes), not a string ("3 min read")
    // Formatting belongs in the component, not the data layer
    file.data.astro.frontmatter.readingTime = Math.ceil(readingTime.minutes);
  };
}
