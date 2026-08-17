import { remark } from "remark";
import html from "remark-html";

export async function markdownToHtml(source: string) {
  const result = await remark().use(html).process(source);
  return result.toString();
}
