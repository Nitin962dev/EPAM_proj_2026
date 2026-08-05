/* ==========================================================================
   AUTHENTICATION MODULE - LOGIN & REGISTER LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initLoginForm();
  initRegisterForm();
});

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  // Quick Demo Buttons
  const fillAdminBtn = document.getElementById('fillAdminDemo');
  const fillCustomerBtn = document.getElementById('fillCustomerDemo');

  if (fillAdminBtn) {
    fillAdminBtn.addEventListener('click', function() {
      document.getElementById('loginEmail').value = 'alex.wright@example.com';
      document.getElementById('loginPassword').value = 'admin123';
    });
  }

  if (fillCustomerBtn) {
    fillCustomerBtn.addEventListener('click', function() {
      document.getElementById('loginEmail').value = 'sarah.j@example.com';
      document.getElementById('loginPassword').value = 'customer123';
    });
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('Login Failed', 'Please enter email and password.', 'error');
      return;
    }

    // Set user session
    let role = 'Senior Administrator';
    let name = 'Alexander Wright';
    let avatar = 'AW';

    if (email.includes('sarah')) {
      name = 'Sarah Jenkins';
      role = 'Premium Member';
      avatar = 'SJ';
    }

    BMS_DB.set(DB_KEYS.SESSION, {
      name: name,
      email: email,
      role: role,
      accNo: 'ACC-99401283',
      avatar: avatar
    });

    showToast('Login Successful', `Welcome back, ${name}! Redirecting...`, 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  });
}

function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!fullName || !email || !password) {
      showToast('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    // Add new customer & new account into DB
    const custId = 'CUST-' + Math.floor(1000 + Math.random() * 9000);
    const accNo = 'ACC-' + Math.floor(10000000 + Math.random() * 90000000);

    const customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];
    customers.push({
      id: custId,
      name: fullName,
      email: email,
      phone: phone || '+1 (555) 000-0000',
      type: 'Standard',
      status: 'Active',
      balance: 500.00, // Initial welcome bonus balance
      joined: new Date().toISOString().substring(0, 10)
    });
    BMS_DB.set(DB_KEYS.CUSTOMERS, customers);

    const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
    accounts.push({
      accNo: accNo,
      name: fullName,
      type: 'Savings Account',
      balance: 500.00,
      currency: 'USD',
      status: 'Active',
      created: new Date().toISOString().substring(0, 10)
    });
    BMS_DB.set(DB_KEYS.ACCOUNTS, accounts);

    // Auto set session
    BMS_DB.set(DB_KEYS.SESSION, {
      name: fullName,
      email: email,
      role: 'Standard Customer',
      accNo: accNo,
      avatar: fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    });

    showToast('Account Created!', 'Welcome bonus of Rs. 500 added! Redirecting to Dashboard...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  });
}

function logout() {
  localStorage.removeItem(DB_KEYS.SESSION);
  showToast('Logged Out', 'You have been safely logged out.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 800);
}
