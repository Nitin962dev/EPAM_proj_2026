/* ==========================================================================
   REPORTS MODULE - FINANCIAL ANALYTICS & CHARTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('monthlyCashflowChart')) {
    initReportsCharts();
  }
});

function initReportsCharts() {
  // Chart 1: Monthly Cashflow Bar Chart
  const ctxBar = document.getElementById('monthlyCashflowChart').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['Q1 Jan', 'Q1 Feb', 'Q1 Mar', 'Q2 Apr', 'Q2 May', 'Q2 Jun', 'Q3 Jul', 'Q3 Aug'],
      datasets: [
        {
          label: 'Inflow (Rs.)',
          data: [42000, 51000, 68000, 59000, 74000, 81000, 79000, 92000],
          backgroundColor: '#2563eb',
          borderRadius: 6
        },
        {
          label: 'Outflow (Rs.)',
          data: [26000, 31000, 42000, 38000, 49000, 53000, 48000, 57000],
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { grid: { color: 'rgba(226, 232, 240, 0.5)' } },
        x: { grid: { display: false } }
      }
    }
  });

  // Chart 2: Category Breakdown Pie Chart
  const ctxPie = document.getElementById('categoryBreakdownChart').getContext('2d');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Mortgage & Loans', 'Vendor Payments', 'Payroll & Salaries', 'Utilities & Ops', 'Investments'],
      datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  });

  // Chart 3: Net Savings Growth Line Chart
  const ctxLine = document.getElementById('savingsGrowthChart').getContext('2d');
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
      datasets: [{
        label: 'Net Reserves Accumulation (Rs.)',
        data: [120000, 240000, 390000, 580000, 810000, 1150000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } }
    }
  });
}
