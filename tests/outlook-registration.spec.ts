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
      `sample${Date.now().toString().slice(-6)}@outlook.com`,
      'enter_username'
    );
    await instrumentedPage.click(registration.nextButton.first(), 'username_next');

    await expect(registration.passwordInput.first()).toBeVisible({ timeout: 45_000 });
    await instrumentedPage.typeHuman(registration.passwordInput.first(), 'Passw0rd!23456', 'enter_password');
    await instrumentedPage.click(registration.nextButton.first(), 'password_next');

    if (await registration.addDetailsHeading.isVisible().catch(() => false)) {
      await expect(registration.countryRegionSelect.first()).toBeVisible({ timeout: 45_000 });
      await registration.countryRegionSelect.first().selectOption({ label: 'Netherlands' }).catch(() => null);
      await registration.birthMonthSelect.first().selectOption({ label: 'May' });
      await registration.birthDaySelect.first().selectOption({ label: '15' });
      await instrumentedPage.fill(registration.birthYearInput.first(), '1997', 'enter_birth_year');
      await instrumentedPage.click(registration.nextButton.first(), 'details_next');
    }

    if (await registration.isChallengePresent()) {
      test.skip(true, 'Signup flow presented a human verification challenge in CI.');
    }

    if (await registration.firstNameInput.first().isVisible().catch(() => false)) {
      await instrumentedPage.fill(registration.firstNameInput.first(), 'Playwright', 'enter_first_name');
      await instrumentedPage.fill(registration.lastNameInput.first(), 'Runner', 'enter_last_name');
      await instrumentedPage.click(registration.nextButton.first(), 'profile_next');
    }
  });
});
