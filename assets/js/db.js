/* ==========================================================================
   LOCALSTORAGE DATABASE & SEED DATA CONTROLLER
   ========================================================================== */

const DB_KEYS = {
  CUSTOMERS: 'bms_customers',
  ACCOUNTS: 'bms_accounts',
  TRANSACTIONS: 'bms_transactions',
  LOANS: 'bms_loans',
  CARDS: 'bms_cards',
  NOTIFICATIONS: 'bms_notifications',
  SESSION: 'bms_session',
  SETTINGS: 'bms_settings'
};

const BMS_DB = {
  // Utility getters & setters
  get: function(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  set: function(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Initialize DB with realistic default seed data if missing
  init: function() {
    if (!this.get(DB_KEYS.CUSTOMERS)) {
      const defaultCustomers = [
        { id: 'CUST-1001', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 234-5678', type: 'Premium', status: 'Active', balance: 48250.00, joined: '2023-01-15' },
        { id: 'CUST-1002', name: 'Alexander Wright', email: 'alex.wright@example.com', phone: '+1 (555) 876-5432', type: 'Business', status: 'Active', balance: 125400.50, joined: '2022-11-20' },
        { id: 'CUST-1003', name: 'Elena Rostova', email: 'elena.r@example.com', phone: '+1 (555) 345-6789', type: 'Standard', status: 'Active', balance: 12350.75, joined: '2023-04-10' },
        { id: 'CUST-1004', name: 'Marcus Vance', email: 'm.vance@example.com', phone: '+1 (555) 987-6543', type: 'VIP', status: 'Active', balance: 310800.00, joined: '2021-08-05' },
        { id: 'CUST-1005', name: 'David Chen', email: 'd.chen@example.com', phone: '+1 (555) 456-7890', type: 'Standard', status: 'Inactive', balance: 2450.00, joined: '2023-09-18' }
      ];
      this.set(DB_KEYS.CUSTOMERS, defaultCustomers);
    }

    if (!this.get(DB_KEYS.ACCOUNTS)) {
      const defaultAccounts = [
        { accNo: 'ACC-88219401', name: 'Sarah Jenkins', type: 'Savings Account', balance: 48250.00, currency: 'USD', status: 'Active', created: '2023-01-15' },
        { accNo: 'ACC-99401283', name: 'Alexander Wright', type: 'Corporate Business', balance: 125400.50, currency: 'USD', status: 'Active', created: '2022-11-20' },
        { accNo: 'ACC-11029384', name: 'Elena Rostova', type: 'Checking Account', balance: 12350.75, currency: 'USD', status: 'Active', created: '2023-04-10' },
        { accNo: 'ACC-44910293', name: 'Marcus Vance', type: 'High Yield Savings', balance: 310800.00, currency: 'USD', status: 'Active', created: '2021-08-05' },
        { accNo: 'ACC-55201928', name: 'David Chen', type: 'Student Savings', balance: 2450.00, currency: 'USD', status: 'Active', created: '2023-09-18' }
      ];
      this.set(DB_KEYS.ACCOUNTS, defaultAccounts);
    }

    if (!this.get(DB_KEYS.TRANSACTIONS)) {
      const defaultTransactions = [
        { id: 'TXN-90412', date: '2026-08-04 14:32', accNo: 'ACC-88219401', desc: 'Wire Transfer Deposit', type: 'Deposit', category: 'Salary / Income', amount: 5000.00, status: 'Completed', ref: 'REF-781920' },
        { id: 'TXN-90411', date: '2026-08-04 11:15', accNo: 'ACC-99401283', desc: 'Vendor Payment to Tech Corp', type: 'Withdrawal', category: 'Business Expense', amount: 1250.00, status: 'Completed', ref: 'REF-781919' },
        { id: 'TXN-90410', date: '2026-08-03 16:45', accNo: 'ACC-11029384', desc: 'Fund Transfer to Marcus Vance', type: 'Transfer', category: 'Interbank Transfer', amount: 800.00, status: 'Completed', ref: 'REF-781918' },
        { id: 'TXN-90409', date: '2026-08-02 09:20', accNo: 'ACC-88219401', desc: 'ATM Cash Withdrawal', type: 'Withdrawal', category: 'Cash', amount: 200.00, status: 'Completed', ref: 'REF-781917' },
        { id: 'TXN-90408', date: '2026-08-01 18:10', accNo: 'ACC-44910293', desc: 'Investment Dividend Deposit', type: 'Deposit', category: 'Investment', amount: 4500.00, status: 'Completed', ref: 'REF-781916' }
      ];
      this.set(DB_KEYS.TRANSACTIONS, defaultTransactions);
    }

    if (!this.get(DB_KEYS.LOANS)) {
      const defaultLoans = [
        { id: 'LN-501', accNo: 'ACC-88219401', borrower: 'Sarah Jenkins', type: 'Home Mortgage', principal: 250000, rate: 4.5, tenure: 240, emi: 1581.71, balance: 215000, status: 'Active' },
        { id: 'LN-502', accNo: 'ACC-99401283', borrower: 'Alexander Wright', type: 'Commercial Expansion', principal: 100000, rate: 6.2, tenure: 60, emi: 1942.50, balance: 64000, status: 'Active' },
        { id: 'LN-503', accNo: 'ACC-11029384', borrower: 'Elena Rostova', type: 'Auto Loan', principal: 35000, rate: 5.0, tenure: 48, emi: 806.00, balance: 18500, status: 'Active' }
      ];
      this.set(DB_KEYS.LOANS, defaultLoans);
    }

    if (!this.get(DB_KEYS.CARDS)) {
      const defaultCards = [
        { id: 'CARD-101', accNo: 'ACC-88219401', holder: 'SARAH JENKINS', number: '4532 •••• •••• 8841', type: 'Visa Platinum Credit', exp: '08/28', cvv: '492', limit: 20000, used: 3450, theme: 'default', status: 'Active' },
        { id: 'CARD-102', accNo: 'ACC-99401283', holder: 'ALEXANDER WRIGHT', number: '5412 •••• •••• 9920', type: 'Mastercard World Elite', exp: '11/29', cvv: '815', limit: 50000, used: 12400, theme: 'black', status: 'Active' },
        { id: 'CARD-103', accNo: 'ACC-11029384', holder: 'ELENA ROSTOVA', number: '4000 •••• •••• 1102', type: 'Visa Sapphire Debit', exp: '04/27', cvv: '239', limit: 10000, used: 1200, theme: 'purple', status: 'Active' }
      ];
      this.set(DB_KEYS.CARDS, defaultCards);
    }

    if (!this.get(DB_KEYS.NOTIFICATIONS)) {
      const defaultNotifications = [
        { id: 1, title: 'Deposit Successful', message: 'Wire deposit of Rs. 5,000.00 received in ACC-88219401', time: '10 mins ago', read: false, icon: 'fas fa-arrow-down text-success' },
        { id: 2, title: 'Security Alert', message: 'New login detected from Mac OS Chrome browser', time: '2 hours ago', read: false, icon: 'fas fa-shield-alt text-warning' },
        { id: 3, title: 'Loan EMI Due', message: 'Home Mortgage EMI of Rs. 1,581.71 due in 3 days', time: '1 day ago', read: true, icon: 'fas fa-calendar-alt text-primary' }
      ];
      this.set(DB_KEYS.NOTIFICATIONS, defaultNotifications);
    }

    if (!this.get(DB_KEYS.SESSION)) {
      // Default logged in user session
      const defaultSession = {
        name: 'Alexander Wright',
        email: 'alex.wright@example.com',
        role: 'Senior Administrator',
        accNo: 'ACC-99401283',
        avatar: 'AW'
      };
      this.set(DB_KEYS.SESSION, defaultSession);
    }

    if (!this.get(DB_KEYS.SETTINGS)) {
      const defaultSettings = {
        theme: 'light',
        currency: 'INR (Rs.)',
        notifications: true,
        twoFactor: true
      };
      this.set(DB_KEYS.SETTINGS, defaultSettings);
    }
  },

  // Perform Deposit
  deposit: function(accNo, amount, method, refNote) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: 'Invalid deposit amount' };

    const accounts = this.get(DB_KEYS.ACCOUNTS) || [];
    const accIndex = accounts.findIndex(a => a.accNo === accNo);
    if (accIndex === -1) return { success: false, message: 'Account not found' };

    // Update Account Balance
    accounts[accIndex].balance += numAmount;
    this.set(DB_KEYS.ACCOUNTS, accounts);

    // Also update Customer record balance if matched
    const customers = this.get(DB_KEYS.CUSTOMERS) || [];
    const custIndex = customers.findIndex(c => c.name === accounts[accIndex].name);
    if (custIndex !== -1) {
      customers[custIndex].balance += numAmount;
      this.set(DB_KEYS.CUSTOMERS, customers);
    }

    // Record Transaction
    const txns = this.get(DB_KEYS.TRANSACTIONS) || [];
    const newTxn = {
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      accNo: accNo,
      desc: `Deposit via ${method} (${refNote || 'Quick Deposit'})`,
      type: 'Deposit',
      category: 'Deposit / Topup',
      amount: numAmount,
      status: 'Completed',
      ref: 'REF-' + Math.floor(100000 + Math.random() * 900000)
    };
    txns.unshift(newTxn);
    this.set(DB_KEYS.TRANSACTIONS, txns);

    // Add Notification
    this.addNotification('Deposit Confirmed', `Successfully deposited Rs. ${numAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} to ${accNo}`, 'fas fa-plus-circle text-success');

    return { success: true, txn: newTxn, newBalance: accounts[accIndex].balance };
  },

  // Perform Withdrawal
  withdraw: function(accNo, amount, channel, refNote) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: 'Invalid withdrawal amount' };

    const accounts = this.get(DB_KEYS.ACCOUNTS) || [];
    const accIndex = accounts.findIndex(a => a.accNo === accNo);
    if (accIndex === -1) return { success: false, message: 'Account not found' };

    if (accounts[accIndex].balance < numAmount) {
      return { success: false, message: 'Insufficient funds for this withdrawal!' };
    }

    // Update Account Balance
    accounts[accIndex].balance -= numAmount;
    this.set(DB_KEYS.ACCOUNTS, accounts);

    // Update Customer record
    const customers = this.get(DB_KEYS.CUSTOMERS) || [];
    const custIndex = customers.findIndex(c => c.name === accounts[accIndex].name);
    if (custIndex !== -1) {
      customers[custIndex].balance -= numAmount;
      this.set(DB_KEYS.CUSTOMERS, customers);
    }

    // Record Transaction
    const txns = this.get(DB_KEYS.TRANSACTIONS) || [];
    const newTxn = {
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      accNo: accNo,
      desc: `Withdrawal via ${channel} (${refNote || 'Cash Out'})`,
      type: 'Withdrawal',
      category: 'Cash / ATM',
      amount: numAmount,
      status: 'Completed',
      ref: 'REF-' + Math.floor(100000 + Math.random() * 900000)
    };
    txns.unshift(newTxn);
    this.set(DB_KEYS.TRANSACTIONS, txns);

    // Add Notification
    this.addNotification('Withdrawal Processed', `Withdrew Rs. ${numAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} from ${accNo}`, 'fas fa-arrow-up text-danger');

    return { success: true, txn: newTxn, newBalance: accounts[accIndex].balance };
  },

  // Perform Transfer
  transfer: function(fromAccNo, toAccNo, amount, transferType, note) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: 'Invalid transfer amount' };

    const accounts = this.get(DB_KEYS.ACCOUNTS) || [];
    const fromIndex = accounts.findIndex(a => a.accNo === fromAccNo);
    if (fromIndex === -1) return { success: false, message: 'Source account not found' };

    if (accounts[fromIndex].balance < numAmount) {
      return { success: false, message: 'Insufficient balance in source account!' };
    }

    // Deduct from sender
    accounts[fromIndex].balance -= numAmount;

    // Credit to receiver if internal account
    const toIndex = accounts.findIndex(a => a.accNo === toAccNo);
    if (toIndex !== -1) {
      accounts[toIndex].balance += numAmount;
    }
    this.set(DB_KEYS.ACCOUNTS, accounts);

    // Record Transaction for sender
    const txns = this.get(DB_KEYS.TRANSACTIONS) || [];
    const newTxn = {
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      accNo: fromAccNo,
      desc: `Transfer to ${toAccNo} (${transferType}) - ${note || 'Fund Transfer'}`,
      type: 'Transfer',
      category: 'Fund Transfer',
      amount: numAmount,
      status: 'Completed',
      ref: 'REF-' + Math.floor(100000 + Math.random() * 900000)
    };
    txns.unshift(newTxn);
    this.set(DB_KEYS.TRANSACTIONS, txns);

    this.addNotification('Transfer Sent', `Transferred Rs. ${numAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} to ${toAccNo}`, 'fas fa-exchange-alt text-info');

    return { success: true, txn: newTxn, newBalance: accounts[fromIndex].balance };
  },

  // Notification helper
  addNotification: function(title, message, icon) {
    const notifs = this.get(DB_KEYS.NOTIFICATIONS) || [];
    notifs.unshift({
      id: Date.now(),
      title: title,
      message: message,
      time: 'Just now',
      read: false,
      icon: icon || 'fas fa-bell text-primary'
    });
    this.set(DB_KEYS.NOTIFICATIONS, notifs);
  },

  // Loan EMI Calculator math helper
  calculateEMI: function(p, r, n) {
    const principal = parseFloat(p);
    const monthlyRate = parseFloat(r) / (12 * 100);
    const tenureMonths = parseFloat(n);
    
    if (principal <= 0 || monthlyRate <= 0 || tenureMonths <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  }
};

// Initialize Database on script load
BMS_DB.init();
