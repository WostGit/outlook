import { type Locator, type Page } from '@playwright/test';

export class OutlookRegistrationPage {
  constructor(private readonly page: Page) {}

  get createFreeAccountButton(): Locator {
    return this.page
      .getByRole('link', { name: /create free account/i })
      .or(this.page.getByRole('button', { name: /create free account/i }));
  }

  get usernameInput(): Locator {
    return this.page.locator('input[name="MemberName"], input#MemberName');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="Password"], input#PasswordInput');
  }

  get firstNameInput(): Locator {
    return this.page.locator('input[name="FirstName"], input#FirstName');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="LastName"], input#LastName');
  }

  get nextButton(): Locator {
    return this.page
      .getByRole('button', { name: /^next$/i })
      .or(this.page.locator('button#iSignupAction'));
  }

  async openRegistration(): Promise<void> {
    await this.page.goto('https://signup.live.com/signup', { waitUntil: 'domcontentloaded' });
  }

  async dismissOptionalBanners(): Promise<void> {
    const maybeAccept = this.page
      .getByRole('button', { name: /accept|agree|continue|allow all/i })
      .first();

    if (await maybeAccept.isVisible().catch(() => false)) {
      await maybeAccept.click();
    }
  }
}
