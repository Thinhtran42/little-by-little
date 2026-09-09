import { expect } from "@playwright/test";

export async function prepareRecall(page, english) {
  await page.getByRole("button", { name: "Lật thẻ xem tiếng Anh" }).click();
  await expect(page.getByRole("dialog")).toContainText(english);
  await page.getByRole("button", { name: "Thử xếp câu →" }).click();
  for (const word of english.split(/\s+/)) {
    await page
      .locator(".word-tiles")
      .getByRole("button", { name: word, exact: true })
      .and(page.locator("button:enabled"))
      .first()
      .click();
  }
  await page.getByRole("button", { name: "Kiểm tra cách xếp" }).click();
  await expect(page.getByRole("dialog")).toContainText("Đúng thứ tự rồi!");
  await page.getByRole("button", { name: "Ẩn gợi ý · tự nhớ câu →" }).click();
}
