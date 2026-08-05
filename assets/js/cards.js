/* ==========================================================================
   CARDS MODULE - VISUAL 3D CREDIT & DEBIT CARDS MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('cardsContainer')) {
    renderCards();
    initRequestCardModal();
  }
});

function renderCards() {
  const container = document.getElementById('cardsContainer');
  if (!container) return;

  const cards = BMS_DB.get(DB_KEYS.CARDS) || [];

  if (cards.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No cards issued yet.</div>';
    return;
  }

  container.innerHTML = cards.map(c => {
    let themeClass = '';
    if (c.theme === 'black') themeClass = 'card-theme-black';
    if (c.theme === 'purple') themeClass = 'card-theme-purple';

    return `
      <div>
        <div class="bank-card-wrapper" onclick="this.classList.toggle('flipped')">
          <div class="bank-card-inner">
            <div class="bank-card-front ${themeClass}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="card-chip"></div>
                <div style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.05em;">APEX BANK</div>
              </div>
              <div class="card-number">${c.number}</div>
              <div class="bank-card-front card-footer">
                <div>
                  <div class="card-holder-name">${c.holder}</div>
                </div>
                <div class="card-exp">${c.exp}</div>
              </div>
            </div>
            <div class="bank-card-back">
              <div class="magnetic-strip"></div>
              <div class="cvv-box">CVV: ${c.cvv}</div>
              <div style="font-size: 0.65rem; text-align: center; opacity: 0.6; padding: 0 1rem;">AUTHORIZED SIGNATURE - NOT VALID UNLESS SIGNED</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem; background: var(--bg-card); padding: 1rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${c.type}</strong>
            <span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}">${c.status}</span>
          </div>
          <div style="margin: 0.5rem 0; font-size: 0.8rem; color: var(--text-muted);">
            Credit Limit: <strong>Rs. ${c.limit.toLocaleString()}</strong> | Used: <strong>Rs. ${c.used.toLocaleString()}</strong>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button class="btn btn-sm btn-secondary" style="flex: 1;" onclick="toggleCardLock('${c.id}')">
              <i class="${c.status === 'Active' ? 'fas fa-lock' : 'fas fa-unlock'}"></i> ${c.status === 'Active' ? 'Block Card' : 'Unblock'}
            </button>
            <button class="btn btn-sm btn-outline" onclick="showToast('Set Limit', 'Limit updated to Rs. ${c.limit}', 'info')">Set Limit</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initRequestCardModal() {
  const form = document.getElementById('requestCardForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const holder = document.getElementById('cardHolderInput').value.trim().toUpperCase();
    const type = document.getElementById('cardTypeSelect').value;
    const theme = document.getElementById('cardThemeSelect').value;

    const cards = BMS_DB.get(DB_KEYS.CARDS) || [];
    cards.push({
      id: 'CARD-' + Math.floor(100 + Math.random() * 900),
      accNo: 'ACC-99401283',
      holder: holder,
      number: '4' + Math.floor(100 + Math.random() * 900) + ' •••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      type: type,
      exp: '12/30',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      limit: 15000,
      used: 0,
      theme: theme,
      status: 'Active'
    });
    BMS_DB.set(DB_KEYS.CARDS, cards);

    showToast('Card Issued!', `New ${type} issued to ${holder}`, 'success');
    closeModal('requestCardModal');
    form.reset();
    renderCards();
  });
}

function toggleCardLock(id) {
  const cards = BMS_DB.get(DB_KEYS.CARDS) || [];
  const idx = cards.findIndex(c => c.id === id);
  if (idx !== -1) {
    cards[idx].status = cards[idx].status === 'Active' ? 'Blocked' : 'Active';
    BMS_DB.set(DB_KEYS.CARDS, cards);
    showToast('Card Status', `Card ${id} status set to ${cards[idx].status}`, 'info');
    renderCards();
  }
}
