import { test, expect } from '../src/fixtures/instrumented';
import { OutlookRegistrationPage } from '../src/pages/OutlookRegistrationPage';

test.describe('Outlook registration', () => {
  test('completes core onboarding fields with instrumentation', async ({ instrumentedPage }) => {
    const page = instrumentedPage.raw();
    const registration = new OutlookRegistrationPage(page);

    await instrumentedPage.goto('https://signup.live.com/signup', 'open_signup_page');
    await registration.dismissOptionalBanners();
    await instrumentedPage.mouseJitter('pre_username_jitter');

    await expect(registration.usernameInput).toBeVisible({ timeout: 30_000 });
    await instrumentedPage.typeHuman(
      registration.usernameInput,
      `sample${Date.now().toString().slice(-6)}`,
      'enter_username'
    );
    await instrumentedPage.click(registration.nextButton, 'username_next');

    await expect(registration.passwordInput).toBeVisible({ timeout: 30_000 });
    await instrumentedPage.typeHuman(registration.passwordInput, 'Passw0rd!23456', 'enter_password');
    await instrumentedPage.click(registration.nextButton, 'password_next');

    await expect(registration.firstNameInput).toBeVisible({ timeout: 30_000 });
    await instrumentedPage.fill(registration.firstNameInput, 'Playwright', 'enter_first_name');
    await instrumentedPage.fill(registration.lastNameInput, 'Runner', 'enter_last_name');
    await instrumentedPage.click(registration.nextButton, 'profile_next');
  });
});
