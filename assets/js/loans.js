/* ==========================================================================
   LOANS MODULE - EMI CALCULATOR & LOAN APPLICATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('loanEmiCalculator')) {
    initEmiCalculator();
    renderLoansList();
    initApplyLoanModal();
  }
});

function initEmiCalculator() {
  const principalSlider = document.getElementById('principalSlider');
  const rateSlider = document.getElementById('rateSlider');
  const tenureSlider = document.getElementById('tenureSlider');

  const pVal = document.getElementById('principalValue');
  const rVal = document.getElementById('rateValue');
  const tVal = document.getElementById('tenureValue');

  const emiDisplay = document.getElementById('calcEmiDisplay');
  const totalPayDisplay = document.getElementById('calcTotalPayDisplay');
  const totalIntDisplay = document.getElementById('calcTotalIntDisplay');

  function calculate() {
    const p = parseFloat(principalSlider.value);
    const r = parseFloat(rateSlider.value);
    const t = parseFloat(tenureSlider.value);

    pVal.textContent = `Rs. ${p.toLocaleString()}`;
    rVal.textContent = `${r}%`;
    tVal.textContent = `${t} Months`;

    const res = BMS_DB.calculateEMI(p, r, t);
    
    if (emiDisplay) emiDisplay.textContent = `Rs. ${parseFloat(res.emi).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (totalPayDisplay) totalPayDisplay.textContent = `Rs. ${parseFloat(res.totalPayment).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (totalIntDisplay) totalIntDisplay.textContent = `Rs. ${parseFloat(res.totalInterest).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  }

  if (principalSlider && rateSlider && tenureSlider) {
    principalSlider.addEventListener('input', calculate);
    rateSlider.addEventListener('input', calculate);
    tenureSlider.addEventListener('input', calculate);
    calculate();
  }
}

function renderLoansList() {
  const container = document.getElementById('loansContainer');
  if (!container) return;

  const loans = BMS_DB.get(DB_KEYS.LOANS) || [];

  if (loans.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center;">No active loans.</div>';
    return;
  }

  container.innerHTML = loans.map(l => `
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary">${l.type}</span>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-top: 0.2rem;">${l.borrower}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">Account: ${l.accNo} | ID: ${l.id}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.78rem; color: var(--text-muted);">Outstanding Balance</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--danger-color);">Rs. ${l.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
        <div><span style="color: var(--text-muted);">Principal:</span> <strong>Rs. ${l.principal.toLocaleString()}</strong></div>
        <div><span style="color: var(--text-muted);">Interest Rate:</span> <strong>${l.rate}%</strong></div>
        <div><span style="color: var(--text-muted);">Tenure:</span> <strong>${l.tenure} mos</strong></div>
        <div><span style="color: var(--text-muted);">Monthly EMI:</span> <strong>Rs. ${l.emi.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></div>
      </div>
    </div>
  `).join('');
}

function initApplyLoanModal() {
  const form = document.getElementById('applyLoanForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const borrower = document.getElementById('loanBorrower').value.trim();
    const type = document.getElementById('loanTypeSelect').value;
    const principal = parseFloat(document.getElementById('loanAmountInput').value);
    const rate = parseFloat(document.getElementById('loanRateInput').value);
    const tenure = parseInt(document.getElementById('loanTenureInput').value);

    const calc = BMS_DB.calculateEMI(principal, rate, tenure);

    const loans = BMS_DB.get(DB_KEYS.LOANS) || [];
    loans.push({
      id: 'LN-' + Math.floor(500 + Math.random() * 500),
      accNo: 'ACC-99401283',
      borrower: borrower,
      type: type,
      principal: principal,
      rate: rate,
      tenure: tenure,
      emi: parseFloat(calc.emi),
      balance: principal,
      status: 'Active'
    });
    BMS_DB.set(DB_KEYS.LOANS, loans);

    showToast('Loan Application Approved!', `Loan of Rs. ${principal.toLocaleString()} granted to ${borrower}`, 'success');
    closeModal('applyLoanModal');
    form.reset();
    renderLoansList();
  });
}
