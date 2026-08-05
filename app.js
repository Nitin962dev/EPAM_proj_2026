/* ==========================================================================
   GLOBAL APP CONTROLLER - UI INTERACTIONS & THEME MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initSidebar();
  initDropdowns();
  initNotifications();
  initGlobalSearch();
  updateSessionInfo();
});

/* Theme Controller */
function initTheme() {
  const settings = BMS_DB.get(DB_KEYS.SETTINGS) || {};
  const currentTheme = settings.theme || 'light';
  setTheme(currentTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(activeTheme);
      settings.theme = activeTheme;
      BMS_DB.set(DB_KEYS.SETTINGS, settings);
      showToast('Theme Updated', `Switched to ${activeTheme} mode.`, 'info');
    });
  });
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.theme-icon').forEach(i => i.className = 'fas fa-sun');
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.querySelectorAll('.theme-icon').forEach(i => i.className = 'fas fa-moon');
  }
}

/* Sidebar Controller */
function initSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
    });
  }

  if (mobileToggleBtn && sidebar) {
    mobileToggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Active Navigation item highlighting based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
}

/* Dropdowns Controller */
function initDropdowns() {
  const userProfileBtn = document.getElementById('userProfileDropdownBtn');
  const userDropdownMenu = document.getElementById('userDropdownMenu');
  const notifBtn = document.getElementById('notificationBtn');
  const notifMenu = document.getElementById('notificationDropdownMenu');

  if (userProfileBtn && userDropdownMenu) {
    userProfileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (notifMenu) notifMenu.classList.remove('show');
      userDropdownMenu.classList.toggle('show');
    });
  }

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (userDropdownMenu) userDropdownMenu.classList.remove('show');
      notifMenu.classList.toggle('show');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (userDropdownMenu && !userDropdownMenu.contains(e.target)) {
      userDropdownMenu.classList.remove('show');
    }
    if (notifMenu && !notifMenu.contains(e.target)) {
      notifMenu.classList.remove('show');
    }
  });
}

/* Notifications UI Sync */
function initNotifications() {
  const notifs = BMS_DB.get(DB_KEYS.NOTIFICATIONS) || [];
  const unreadCount = notifs.filter(n => !n.read).length;
  
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  const notifListContainer = document.getElementById('notificationList');
  if (notifListContainer) {
    if (notifs.length === 0) {
      notifListContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications</div>';
      return;
    }

    notifListContainer.innerHTML = notifs.map(n => `
      <div class="notification-item">
        <div class="notification-icon">
          <i class="${n.icon}"></i>
        </div>
        <div class="notification-content">
          <p><strong>${n.title}</strong>: ${n.message}</p>
          <span>${n.time}</span>
        </div>
      </div>
    `).join('');
  }
}

/* Session Info Sync */
function updateSessionInfo() {
  const session = BMS_DB.get(DB_KEYS.SESSION);
  if (!session) return;

  document.querySelectorAll('.session-user-name').forEach(el => el.textContent = session.name);
  document.querySelectorAll('.session-user-role').forEach(el => el.textContent = session.role);
  document.querySelectorAll('.session-user-avatar').forEach(el => el.textContent = session.avatar || 'AW');
}

/* Global Search Handler */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          showToast('Global Search', `Searching records for "${query}"...`, 'info');
          // Navigate to transactions or customers with query
          window.location.href = `transactions.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

/* Toast Notifications Generator */
function showToast(title, message, type = 'info') {
  let toastContainer = document.getElementById('globalToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'globalToastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fas fa-info-circle';
  if (type === 'success') iconClass = 'fas fa-check-circle';
  if (type === 'error') iconClass = 'fas fa-exclamation-circle';
  if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="toast-message">
      <p style="margin-bottom: 2px;"><strong>${title}</strong></p>
      <span style="font-size: 0.8rem; color: var(--text-muted);">${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* Modal Helper Utilities */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}
