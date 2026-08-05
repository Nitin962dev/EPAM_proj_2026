/* ==========================================================================
   CUSTOMERS MODULE - DIRECTORY & MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('customersTableBody')) {
    renderCustomersTable();
    initCustomerSearch();
    initAddCustomerModal();
  }
});

function renderCustomersTable(filterText = '') {
  const tableBody = document.getElementById('customersTableBody');
  if (!tableBody) return;

  let customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];

  if (filterText) {
    const q = filterText.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) || 
      c.id.toLowerCase().includes(q)
    );
  }

  if (customers.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No customer records matched your query.</td></tr>';
    return;
  }

  tableBody.innerHTML = customers.map(c => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${c.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <strong>${c.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${c.email}</div>
          </div>
        </div>
      </td>
      <td>${c.phone}</td>
      <td><span class="badge badge-primary">${c.type}</span></td>
      <td><strong>Rs. ${(c.balance || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
      <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}">${c.status}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="viewCustomer('${c.id}')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-sm btn-outline" onclick="toggleCustomerStatus('${c.id}')">${c.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
      </td>
    </tr>
  `).join('');
}

function initCustomerSearch() {
  const input = document.getElementById('customerSearchInput');
  if (input) {
    input.addEventListener('input', function() {
      renderCustomersTable(this.value.trim());
    });
  }
}

function initAddCustomerModal() {
  const form = document.getElementById('addCustomerForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const type = document.getElementById('custType').value;
    const initialDeposit = parseFloat(document.getElementById('custDeposit').value) || 0;

    const custId = 'CUST-' + Math.floor(1000 + Math.random() * 9000);
    const accNo = 'ACC-' + Math.floor(10000000 + Math.random() * 90000000);

    const customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];
    customers.push({
      id: custId,
      name: name,
      email: email,
      phone: phone,
      type: type,
      status: 'Active',
      balance: initialDeposit,
      joined: new Date().toISOString().substring(0, 10)
    });
    BMS_DB.set(DB_KEYS.CUSTOMERS, customers);

    // Create Account for customer
    const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
    accounts.push({
      accNo: accNo,
      name: name,
      type: `${type} Account`,
      balance: initialDeposit,
      currency: 'INR',
      status: 'Active',
      created: new Date().toISOString().substring(0, 10)
    });
    BMS_DB.set(DB_KEYS.ACCOUNTS, accounts);

    showToast('Customer Added', `Customer ${name} registered with account ${accNo}`, 'success');
    closeModal('addCustomerModal');
    form.reset();
    renderCustomersTable();
  });
}

function toggleCustomerStatus(id) {
  const customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];
  const idx = customers.findIndex(c => c.id === id);
  if (idx !== -1) {
    customers[idx].status = customers[idx].status === 'Active' ? 'Inactive' : 'Active';
    BMS_DB.set(DB_KEYS.CUSTOMERS, customers);
    showToast('Status Updated', `Customer ${customers[idx].name} status is now ${customers[idx].status}`, 'info');
    renderCustomersTable();
  }
}

function viewCustomer(id) {
  const customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];
  const cust = customers.find(c => c.id === id);
  if (cust) {
    alert(`Customer Overview:\nID: ${cust.id}\nName: ${cust.name}\nEmail: ${cust.email}\nPhone: ${cust.phone}\nTier: ${cust.type}\nBalance: Rs. ${cust.balance.toFixed(2)}\nStatus: ${cust.status}`);
  }
}
