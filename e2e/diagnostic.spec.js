import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
test("collect visual and accessibility evidence", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Luyện tập", exact: true }).click();
  await page.screenshot({ path: "artifacts/v3-practice.png", fullPage: true });
  await page.getByRole("button", { name: /Một ly cà phê đúng ý/ }).click();
  await page.screenshot({ path: "artifacts/v3-dialogue.png", fullPage: true });
  await page.keyboard.press("Escape");
  const reports = {};
  for (const route of ["home", "practice", "insights", "account"]) {
    await page.goto("/#" + route);
    await expect(page.locator('.sync-banner')).toBeVisible();
    await page.screenshot({ path: `artifacts/v3-${route}.png`, fullPage: true });
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    reports[route] = r.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    }));
  }
  fs.writeFileSync(
    "artifacts/accessibility.json",
    JSON.stringify(reports, null, 2),
  );
  expect(Object.values(reports).flat()).toEqual([]);
});
