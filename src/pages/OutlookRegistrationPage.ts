import { type Locator, type Page } from '@playwright/test';

export class OutlookRegistrationPage {
  constructor(private readonly page: Page) {}

  get createFreeAccountButton(): Locator {
    return this.page.getByRole('link', { name: /create free account/i });
  }

  get usernameInput(): Locator {
    return this.page.locator('input[name="MemberName"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="Password"]');
  }

  get firstNameInput(): Locator {
    return this.page.locator('input[name="FirstName"]');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="LastName"]');
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: /^next$/i });
  }

  async openRegistration(): Promise<void> {
    await this.page.goto('/');
    await this.createFreeAccountButton.click();
  }
}
