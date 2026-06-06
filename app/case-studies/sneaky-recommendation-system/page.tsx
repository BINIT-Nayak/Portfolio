import fs from "fs";
import Link from "next/link";
import path from "path";

import style from "./page.module.css";

export const metadata = {
  title: "Sneaky Recommendation System Case Study",
  description:
    "A detailed case study on building Sneaky's points-based recommendation system before machine learning.",
};

const articlePath = path.join(process.cwd(), "data/case-studies/sneaky-recommendation-system.md");

const article = fs.readFileSync(articlePath, "utf8");

const renderInline = (text: string) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
};

const parseMarkdown = (content: string) => {
  const lines = content.split("\n");
  const blocks: JSX.Element[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <pre className={style.article__code_block} key={`code-${index}`}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      index += 1;
      continue;
    }

    if (trimmedLine === "---") {
      blocks.push(<hr className={style.article__divider} key={`divider-${index}`} />);
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("# ")) {
      blocks.push(
        <h1 className={style.article__title} key={`h1-${index}`}>
          {renderInline(trimmedLine.slice(2))}
        </h1>
      );
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("## ")) {
      blocks.push(
        <h2 className={style.article__heading} key={`h2-${index}`}>
          {renderInline(trimmedLine.slice(3))}
        </h2>
      );
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("### ")) {
      blocks.push(
        <h3 className={style.article__subheading} key={`h3-${index}`}>
          {renderInline(trimmedLine.slice(4))}
        </h3>
      );
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("* ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("* ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <ul className={style.article__list} key={`ul-${index}`}>
          {items.map((item) => (
            <li className={style.article__list_item} key={item}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(trimmedLine)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, ""));
        index += 1;
      }

      blocks.push(
        <ol className={style.article__list} key={`ol-${index}`}>
          {items.map((item) => (
            <li className={style.article__list_item} key={item}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines = [trimmedLine];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("#") &&
      !lines[index].trim().startsWith("* ") &&
      !/^\d+\.\s/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("```") &&
      lines[index].trim() !== "---"
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p className={style.article__paragraph} key={`p-${index}`}>
        {renderInline(paragraphLines.join(" "))}
      </p>
    );
  }

  return blocks;
};

const SneakyRecommendationCaseStudyPage = () => {
  return (
    <main className={style.article}>
      <div className={style.article__container}>
        <Link className={style.article__back_link} href="/#case-studies">
          Back to Case Studies
        </Link>

        <article className={style.article__content}>{parseMarkdown(article)}</article>
      </div>
    </main>
  );
};

export default SneakyRecommendationCaseStudyPage;
