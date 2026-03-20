import { test, expect } from '../src/fixtures/instrumented';
import { OutlookRegistrationPage } from '../src/pages/OutlookRegistrationPage';

test.describe('Outlook registration', () => {
  test('completes core onboarding fields with instrumentation', async ({ instrumentedPage }) => {
    const page = instrumentedPage.raw();
    const registration = new OutlookRegistrationPage(page);

    await instrumentedPage.goto('https://signup.live.com/signup', 'open_signup_page');
    await registration.dismissOptionalBanners();
    await instrumentedPage.mouseJitter('pre_username_jitter');

    if (await registration.isChallengePresent()) {
      test.skip(true, 'Signup page presented a human verification challenge in CI.');
    }

    await expect(registration.usernameInput.first()).toBeVisible({ timeout: 45_000 });
    await instrumentedPage.typeHuman(
      registration.usernameInput.first(),
      `sample${Date.now().toString().slice(-6)}`,
      'enter_username'
    );
    await instrumentedPage.click(registration.nextButton.first(), 'username_next');

    await expect(registration.passwordInput.first()).toBeVisible({ timeout: 45_000 });
    await instrumentedPage.typeHuman(registration.passwordInput.first(), 'Passw0rd!23456', 'enter_password');
    await instrumentedPage.click(registration.nextButton.first(), 'password_next');

    await expect(registration.firstNameInput.first()).toBeVisible({ timeout: 45_000 });
    await instrumentedPage.fill(registration.firstNameInput.first(), 'Playwright', 'enter_first_name');
    await instrumentedPage.fill(registration.lastNameInput.first(), 'Runner', 'enter_last_name');
    await instrumentedPage.click(registration.nextButton.first(), 'profile_next');
  });
});
