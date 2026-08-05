/* ==========================================================================
   SETTINGS MODULE - PREFERENCES & DATA RESET
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('settingsForm')) {
    initSettingsForm();
  }
});

function initSettingsForm() {
  const settings = BMS_DB.get(DB_KEYS.SETTINGS) || {};

  const themeSelect = document.getElementById('settingsTheme');
  const currencySelect = document.getElementById('settingsCurrency');
  const notifCheck = document.getElementById('settingsNotifications');
  const twoFactorCheck = document.getElementById('settings2FA');

  if (themeSelect) themeSelect.value = settings.theme || 'light';
  if (currencySelect) currencySelect.value = settings.currency || 'INR (Rs.)';
  if (notifCheck) notifCheck.checked = settings.notifications !== false;
  if (twoFactorCheck) twoFactorCheck.checked = settings.twoFactor !== false;

  const form = document.getElementById('settingsForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newSettings = {
      theme: themeSelect.value,
      currency: currencySelect.value,
      notifications: notifCheck.checked,
      twoFactor: twoFactorCheck.checked
    };

    BMS_DB.set(DB_KEYS.SETTINGS, newSettings);
    setTheme(newSettings.theme);

    showToast('Settings Saved', 'Your system preferences have been updated.', 'success');
  });
}

function resetAllData() {
  if (confirm('Are you sure you want to reset all LocalStorage data to initial defaults? This will erase custom records.')) {
    localStorage.clear();
    BMS_DB.init();
    showToast('Data Reset', 'All database tables restored to initial seed state.', 'warning');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
