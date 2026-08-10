/* ==========================================================================
   ACCOUNTS MODULE - BANK ACCOUNTS MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('accountsGridContainer')) {
    renderAccountsGrid();
    initOpenAccountModal();
  }
});

function renderAccountsGrid() {
  const container = document.getElementById('accountsGridContainer');
  if (!container) return;

  const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];

  if (accounts.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">No bank accounts found.</div>';
    return;
  }

  container.innerHTML = accounts.map(a => `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-primary">Rs. {a.type}</span>
          <h4 style="margin-top: 0.35rem; font-size: 1.1rem; font-weight: 700; color: var(--text-main);">Rs.{a.name}</h4>
        </div>
        <span class="badge Rs{a.status === 'Active' ? 'badge-success' : 'badge-danger'}">Rs.{a.status}</span>
      </div>
      <div style="margin: 1.25rem 0;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ACCOUNT NUMBER</div>
        <div style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: var(--text-main); letter-spacing: 0.05em; margin-top: 0.1rem;">${a.accNo}</div>
      </div>
      <div style="display: flex; align-items: baseline; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Current Balance</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-600);">Rs. ${a.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="toggleAccountFreeze('${a.accNo}')">
          <i class="${a.status === 'Active' ? 'fas fa-lock' : 'fas fa-unlock'}"></i> ${a.status === 'Active' ? 'Freeze' : 'Unfreeze'}
        </button>
      </div>
    </div>
  `).join('');
}

function initOpenAccountModal() {
  const form = document.getElementById('openAccountForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('accName').value.trim();
    const type = document.getElementById('accType').value;
    const initialDeposit = parseFloat(document.getElementById('accInitialDeposit').value) || 0;

    const accNo = 'ACC-' + Math.floor(10000000 + Math.random() * 90000000);

    const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
    accounts.push({
      accNo: accNo,
      name: name,
      type: type,
      balance: initialDeposit,
      currency: 'USD',
      status: 'Active',
      created: new Date().toISOString().substring(0, 10)
    });
    BMS_DB.set(DB_KEYS.ACCOUNTS, accounts);

    showToast('Account Opened!', `New ${type} created for ${name} (${accNo})`, 'success');
    closeModal('openAccountModal');
    form.reset();
    renderAccountsGrid();
  });
}

function toggleAccountFreeze(accNo) {
  const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
  const idx = accounts.findIndex(a => a.accNo === accNo);
  if (idx !== -1) {
    accounts[idx].status = accounts[idx].status === 'Active' ? 'Frozen' : 'Active';
    BMS_DB.set(DB_KEYS.ACCOUNTS, accounts);
    showToast('Account Status', `Account ${accNo} status changed to ${accounts[idx].status}`, 'info');
    renderAccountsGrid();
  }
}
