/* ==========================================================================
   PROFILE MODULE - USER PROFILE & SECURITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('profileForm')) {
    initProfilePage();
  }
});

function initProfilePage() {
  const session = BMS_DB.get(DB_KEYS.SESSION) || {};

  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const roleInput = document.getElementById('profileRole');

  if (nameInput) nameInput.value = session.name || '';
  if (emailInput) emailInput.value = session.email || '';
  if (roleInput) roleInput.value = session.role || '';

  const form = document.getElementById('profileForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    session.name = nameInput.value.trim();
    session.email = emailInput.value.trim();
    session.avatar = session.name.split(' ').map(n => n[0]).join('').toUpperCase();

    BMS_DB.set(DB_KEYS.SESSION, session);
    updateSessionInfo();

    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  });
}
