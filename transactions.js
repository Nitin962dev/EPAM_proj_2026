/* ==========================================================================
   TRANSACTIONS MODULE - DEPOSIT, WITHDRAW, TRANSFER & LEDGER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initDepositPage();
  initWithdrawPage();
  initTransferPage();
  initTransactionsPage();
  populateAccountDropdowns();
});

function populateAccountDropdowns() {
  const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
  const dropdowns = document.querySelectorAll('.account-select-dropdown');
  
  dropdowns.forEach(select => {
    select.innerHTML = accounts.map(a => 
      `<option value="${a.accNo}">${a.name} (${a.accNo}) - Rs. ${a.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</option>`
    ).join('');
  });
}

/* Deposit Page */
function initDepositPage() {
  const form = document.getElementById('depositForm');
  if (!form) return;

  // Quick Amount Buttons
  const quickBtns = document.querySelectorAll('.quick-amount-btn');
  quickBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const amt = this.getAttribute('data-amount');
      document.getElementById('depositAmountInput').value = amt;
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const accNo = document.getElementById('depositAccountSelect').value;
    const amount = document.getElementById('depositAmountInput').value;
    const method = document.getElementById('depositMethodSelect').value;
    const note = document.getElementById('depositNoteInput').value;

    const res = BMS_DB.deposit(accNo, amount, method, note);
    if (res.success) {
      showReceiptModal('Deposit Successful', res.txn, res.newBalance);
      form.reset();
      populateAccountDropdowns();
    } else {
      showToast('Deposit Failed', res.message, 'error');
    }
  });
}

/* Withdraw Page */
function initWithdrawPage() {
  const form = document.getElementById('withdrawForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const accNo = document.getElementById('withdrawAccountSelect').value;
    const amount = document.getElementById('withdrawAmountInput').value;
    const channel = document.getElementById('withdrawChannelSelect').value;
    const note = document.getElementById('withdrawNoteInput').value;

    const res = BMS_DB.withdraw(accNo, amount, channel, note);
    if (res.success) {
      showReceiptModal('Withdrawal Completed', res.txn, res.newBalance);
      form.reset();
      populateAccountDropdowns();
    } else {
      showToast('Withdrawal Failed', res.message, 'error');
    }
  });
}

/* Transfer Page */
function initTransferPage() {
  const form = document.getElementById('transferForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fromAcc = document.getElementById('transferFromSelect').value;
    const toAcc = document.getElementById('transferToInput').value.trim();
    const amount = document.getElementById('transferAmountInput').value;
    const type = document.getElementById('transferTypeSelect').value;
    const note = document.getElementById('transferNoteInput').value;

    const res = BMS_DB.transfer(fromAcc, toAcc, amount, type, note);
    if (res.success) {
      showReceiptModal('Fund Transfer Sent', res.txn, res.newBalance);
      form.reset();
      populateAccountDropdowns();
    } else {
      showToast('Transfer Failed', res.message, 'error');
    }
  });
}

/* Transactions Table & Filters */
function initTransactionsPage() {
  const tableBody = document.getElementById('allTransactionsTableBody');
  if (!tableBody) return;

  // Check URL parameters for search query
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('search') || '';

  const searchInput = document.getElementById('txnSearchInput');
  const typeSelect = document.getElementById('txnTypeFilter');
  if (searchInput && initialSearch) searchInput.value = initialSearch;

  function renderTxns() {
    let txns = BMS_DB.get(DB_KEYS.TRANSACTIONS) || [];

    const q = (searchInput ? searchInput.value : '').toLowerCase();
    const filterType = typeSelect ? typeSelect.value : 'all';

    if (q) {
      txns = txns.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.desc.toLowerCase().includes(q) || 
        t.accNo.toLowerCase().includes(q) ||
        t.ref.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') {
      txns = txns.filter(t => t.type.toLowerCase() === filterType.toLowerCase());
    }

    if (txns.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">No matching transactions found.</td></tr>';
      return;
    }

    tableBody.innerHTML = txns.map(t => {
      let badgeClass = 'badge-primary';
      if (t.type === 'Withdrawal') badgeClass = 'badge-danger';
      if (t.type === 'Transfer') badgeClass = 'badge-warning';

      return `
        <tr>
          <td><strong>${t.id}</strong></td>
          <td>${t.date}</td>
          <td><strong>${t.accNo}</strong></td>
          <td>${t.desc}</td>
          <td><span class="badge ${badgeClass}">${t.type}</span></td>
          <td><strong>${t.type === 'Deposit' ? '+' : '-'}Rs. ${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
          <td><button class="btn btn-sm btn-secondary" onclick="previewTxnReceipt('${t.id}')"><i class="fas fa-file-invoice"></i> Receipt</button></td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderTxns);
  if (typeSelect) typeSelect.addEventListener('change', renderTxns);

  renderTxns();
}

/* Receipt Modal Renderer */
function showReceiptModal(title, txn, newBalance) {
  const modalHtml = `
    <div class="modal-backdrop show" id="dynamicReceiptModal">
      <div class="modal">
        <div class="modal-header">
          <h4 class="modal-title">${title}</h4>
          <button class="modal-close-btn" onclick="closeDynamicModal('dynamicReceiptModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="receipt-box">
            <div class="receipt-status-icon"><i class="fas fa-check"></i></div>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">TRANSACTION AMOUNT</div>
            <div class="receipt-amount">Rs. ${txn.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            <div style="margin-top: 1.5rem;">
              <div class="receipt-row"><span>Transaction ID</span><span>${txn.id}</span></div>
              <div class="receipt-row"><span>Reference No</span><span>${txn.ref}</span></div>
              <div class="receipt-row"><span>Account No</span><span>${txn.accNo}</span></div>
              <div class="receipt-row"><span>Transaction Type</span><span>${txn.type}</span></div>
              <div class="receipt-row"><span>Date & Time</span><span>${txn.date}</span></div>
              <div class="receipt-row"><span>Updated Balance</span><span>Rs. ${newBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeDynamicModal('dynamicReceiptModal')">Close</button>
          <button class="btn btn-primary" onclick="showToast('Print', 'Downloading transaction receipt PDF...', 'success'); closeDynamicModal('dynamicReceiptModal');"><i class="fas fa-download"></i> Download Receipt</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function previewTxnReceipt(txnId) {
  const txns = BMS_DB.get(DB_KEYS.TRANSACTIONS) || [];
  const txn = txns.find(t => t.id === txnId);
  if (txn) {
    showReceiptModal('Transaction Details', txn, 48250.00);
  }
}

function closeDynamicModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
}
