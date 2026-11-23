import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8");
function luminance(hex) {
  let value = hex.slice(1);
  if (value.length === 3) value = [...value].map((digit) => digit + digit).join("");
  const [r, g, b] = value.match(/../g).map((part) => {
    const channel = parseInt(part, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
for (const selector of [":root", ".light"]) {
  test(`${selector}: text and focus tokens preserve AA contrast on solid surfaces`, () => {
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    const colors = Object.fromEntries(
      [...block.matchAll(/--color-([\w-]+):\s*(#[\da-f]+);/g)].map(([, key, value]) => [key, value])
    );
    for (const background of ["bg", "surface", "surface-raised", "surface-hover"]) {
      for (const foreground of ["text", "text-secondary", "text-muted"]) {
        assert.ok(
          contrast(colors[foreground], colors[background]) >= 4.5,
          `${foreground} / ${background}`
        );
      }
      assert.ok(contrast(colors.focus, colors[background]) >= 3, `focus / ${background}`);
    }
    for (const background of ["accent", "accent-hover"]) {
      assert.ok(
        contrast(colors["on-accent"], colors[background]) >= 4.5,
        `on-accent / ${background}`
      );
    }
  });
}
