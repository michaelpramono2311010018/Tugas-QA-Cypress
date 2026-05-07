class OrangeHRMPage {
  
  // 1. Identifikasi Elemen (Data Selector)
  elements = {
    // Area Login
    usernameInput: () => cy.get('input[name="username"]', { timeout: 10000 }),
    passwordInput: () => cy.get('input[name="password"]', { timeout: 10000 }),
    loginBtn: () => cy.get('button[type="submit"]', { timeout: 10000 }),
    forgotPassLink: () => cy.get('.orangehrm-login-forgot p', { timeout: 10000 }),
    
    // Area Forgot Password
    resetUsernameInput: () => cy.get('input[name="username"]', { timeout: 10000 }),
    resetBtn: () => cy.get('button[type="submit"]', { timeout: 10000 }),
    cancelBtn: () => cy.get('button[type="button"]', { timeout: 10000 }),
    resetSuccessMsg: () => cy.get('.orangehrm-forgot-password-title', { timeout: 10000 }),

    // Area Dashboard & Directory
    directoryMenu: () => cy.get('a[href*="viewDirectory"]', { timeout: 15000 }),
    searchNameInput: () => cy.get('input[placeholder="Type for hints..."]', { timeout: 10000 }),
    searchDirBtn: () => cy.get('button[type="submit"]', { timeout: 10000 }),
    resetDirBtn: () => cy.contains('button', 'Reset', { timeout: 10000 }),
    employeeCard: () => cy.get('.oxd-directory-card', { timeout: 15000 }),

    // Area Header / Logout
    userDropdown: () => cy.get('.oxd-userdropdown-tab', { timeout: 10000 }),
    logoutLink: () => cy.get('a[href*="logout"]', { timeout: 10000 })
  }

  // 2. Metode Aksi (Actions)
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  login(user, pass) {
    this.elements.usernameInput().type(user);
    this.elements.passwordInput().type(pass);
    this.elements.loginBtn().click();
  }

  clickForgotPassword() {
    this.elements.forgotPassLink().click();
  }

  submitResetPassword(user) {
    this.elements.resetUsernameInput().type(user);
    this.elements.resetBtn().click();
  }

  goToDirectory() {
    this.elements.directoryMenu().click();
  }

  searchEmployeeName(name) {
    this.elements.searchNameInput().type(name);
    this.elements.searchDirBtn().click();
  }

  logout() {
    this.elements.userDropdown().click();
    this.elements.logoutLink().click();
  }
}

export default new OrangeHRMPage();
