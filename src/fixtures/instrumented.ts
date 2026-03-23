import { test as base, expect, type Page, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

class InstrumentedPage {
  constructor(private readonly page: Page, private readonly testOutputDir: string) {}

  private async capture(step: string): Promise<void> {
    const safeStep = step.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
    await mkdir(this.testOutputDir, { recursive: true });

    const domPath = path.join(this.testOutputDir, `${safeStep}.dom.html`);
    const shotPath = path.join(this.testOutputDir, `${safeStep}.fullpage.png`);

    await this.page.screenshot({ path: shotPath, fullPage: true });
    const dom = await this.page.content();
    await writeFile(domPath, dom, 'utf8');
  }

  async goto(url: string, step = 'goto'): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.capture(step);
  }

  async click(locator: Locator, step: string): Promise<void> {
    await locator.click();
    await this.capture(step);
  }

  async fill(locator: Locator, value: string, step: string): Promise<void> {
    await locator.fill(value);
    await this.capture(step);
  }

  async typeHuman(locator: Locator, value: string, step: string): Promise<void> {
    await locator.click();
    for (const ch of value) {
      await locator.type(ch, { delay: 40 + Math.floor(Math.random() * 80) });
    }
    await this.capture(step);
  }

  async mouseJitter(step: string, points = 4): Promise<void> {
    const viewport = this.page.viewportSize() ?? { width: 1280, height: 720 };
    for (let i = 0; i < points; i += 1) {
      await this.page.mouse.move(
        Math.floor(Math.random() * viewport.width),
        Math.floor(Math.random() * viewport.height),
        { steps: 3 + Math.floor(Math.random() * 5) }
      );
    }
    await this.capture(step);
  }

  raw(): Page {
    return this.page;
  }
}

type Fixtures = {
  instrumentedPage: InstrumentedPage;
};

export const test = base.extend<Fixtures>({
  instrumentedPage: async ({ page }, use, testInfo) => {
    const wrapper = new InstrumentedPage(page, testInfo.outputDir);
    await use(wrapper);
  }
});

export { expect };
