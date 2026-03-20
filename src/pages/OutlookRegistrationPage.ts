import { type Locator, type Page } from '@playwright/test';

export class OutlookRegistrationPage {
  constructor(private readonly page: Page) {}

  get usernameInput(): Locator {
    return this.page.locator(
      [
        'input[name="MemberName"]',
        'input#MemberName',
        'input[type="email"]',
        'input[name="Username"]',
        'input[autocomplete="username"]'
      ].join(', ')
    );
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="Password"], input#PasswordInput, input[type="password"]');
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
      .or(this.page.locator('button#iSignupAction'))
      .or(this.page.getByRole('button', { name: /continue/i }));
  }

  get humanVerificationSignals(): Locator {
    return this.page.locator(
      [
        'iframe[title*="captcha" i]',
        'iframe[src*="captcha" i]',
        'text=/verify (you are )?human/i',
        'text=/complete the puzzle/i',
        'text=/unusual activity/i'
      ].join(', ')
    );
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

  async isChallengePresent(): Promise<boolean> {
    return this.humanVerificationSignals.first().isVisible().catch(() => false);
  }
}
