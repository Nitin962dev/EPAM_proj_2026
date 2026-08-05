/* ==========================================================================
   DASHBOARD CONTROLLER - CHARTS & SUMMARY METRICS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dashboardIncomeExpenseChart')) {
    initDashboardMetrics();
    renderCharts();
    renderRecentTransactions();
    initQuickTransfer();
  }
});

function initDashboardMetrics() {
  const accounts = BMS_DB.get(DB_KEYS.ACCOUNTS) || [];
  const customers = BMS_DB.get(DB_KEYS.CUSTOMERS) || [];
  const txns = BMS_DB.get(DB_KEYS.TRANSACTIONS) || [];
  const loans = BMS_DB.get(DB_KEYS.LOANS) || [];

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const totalDeposits = txns.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalLoans = loans.reduce((sum, l) => sum + (l.balance || 0), 0);

  const elBalance = document.getElementById('dashTotalBalance');
  const elCustomers = document.getElementById('dashActiveCustomers');
  const elDeposits = document.getElementById('dashTotalDeposits');
  const elLoans = document.getElementById('dashTotalLoans');

  if (elBalance) elBalance.textContent = `Rs. ${totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  if (elCustomers) elCustomers.textContent = customers.length;
  if (elDeposits) elDeposits.textContent = `Rs. ${totalDeposits.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  if (elLoans) elLoans.textContent = `Rs. ${totalLoans.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

function renderCharts() {
  // Chart 1: Income vs Expense Cashflow Line Chart
  const ctxLine = document.getElementById('dashboardIncomeExpenseChart').getContext('2d');
  if (ctxLine) {
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Total Deposits (Rs.)',
            data: [28000, 32000, 45000, 41000, 56000, 62000, 58000, 72000],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
          },
          {
            label: 'Total Withdrawals (Rs.)',
            data: [18000, 21000, 29000, 24000, 31000, 38000, 34000, 41000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.5)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Chart 2: Account Distribution Doughnut Chart
  const ctxDoughnut = document.getElementById('dashboardAccountTypeChart');
  if (ctxDoughnut) {
    new Chart(ctxDoughnut.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Savings', 'Corporate', 'Checking', 'High Yield'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '72%'
      }
    });
  }
}

function renderRecentTransactions() {
  const tableBody = document.getElementById('recentTxnTableBody');
  if (!tableBody) return;

  const txns = (BMS_DB.get(DB_KEYS.TRANSACTIONS) || []).slice(0, 5);

  if (txns.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No recent transactions found.</td></tr>';
    return;
  }

  tableBody.innerHTML = txns.map(t => {
    let typeClass = 'badge-primary';
    let sign = '+';
    if (t.type === 'Withdrawal') { typeClass = 'badge-danger'; sign = '-'; }
    if (t.type === 'Transfer') { typeClass = 'badge-warning'; sign = '-'; }

    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.date}</td>
        <td>${t.desc}</td>
        <td><span class="badge ${typeClass}">${t.type}</span></td>
        <td><strong>${t.type === 'Deposit' ? '+' : '-'}Rs. ${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
        <td><span class="badge badge-success"><i class="fas fa-check-circle"></i> ${t.status}</span></td>
      </tr>
    `;
  }).join('');
}

function initQuickTransfer() {
  const form = document.getElementById('quickTransferForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const toAcc = document.getElementById('quickToAccount').value;
    const amount = document.getElementById('quickAmount').value;

    const res = BMS_DB.transfer('ACC-99401283', toAcc, amount, 'Instant', 'Quick Transfer Widget');
    if (res.success) {
      showToast('Transfer Completed!', `Rs. ${parseFloat(amount).toFixed(2)} sent to ${toAcc}`, 'success');
      form.reset();
      initDashboardMetrics();
      renderRecentTransactions();
    } else {
      showToast('Transfer Failed', res.message, 'error');
    }
  });
}
