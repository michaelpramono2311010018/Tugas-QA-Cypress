class LoginPage {
  
  // 1. Identifikasi Elemen (Data Selector)
  elements = {
    usernameInput: () => cy.get('input[name="username"]', { timeout: 10000 }),
    passwordInput: () => cy.get('input[name="password"]', { timeout: 10000 }),
    loginButton: () => cy.get('button[type="submit"]', { timeout: 10000 }),
    errorMessage: () => cy.contains('Invalid credentials', { timeout: 10000 }),
    requiredMessage: () => cy.get('.oxd-input-field-error-message', { timeout: 10000 }),
    forgotPasswordLink: () => cy.get('.orangehrm-login-forgot p', { timeout: 10000 }),
    companyLogo: () => cy.get('img[alt="company-branding"]', { timeout: 10000 }),
    
    dashboardHeader: () => cy.get('header .oxd-topbar-header-title h6', { timeout: 15000 })
  }

  // 2. Metode Aksi (Actions)
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  fillUsername(username) {
    this.elements.usernameInput().type(username);
  }

  fillPassword(password) {
    this.elements.passwordInput().type(password);
  }

  clickLogin() {
    this.elements.loginButton().click();
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
  }

  // 3. Metode Validasi (Assertions)
  verifyErrorCredential() {
    this.elements.errorMessage().should('be.visible');
  }

  verifyDashboardPage() {
    cy.url().should('include', '/dashboard');
    this.elements.dashboardHeader().should('have.text', 'Dashboard');
  }

  verifyPasswordIsMasked() {
    this.elements.passwordInput().should('have.attr', 'type', 'password');
  }

  verifyLogoVisible() {
    this.elements.companyLogo().should('be.visible');
  }

}

export default new LoginPage();
