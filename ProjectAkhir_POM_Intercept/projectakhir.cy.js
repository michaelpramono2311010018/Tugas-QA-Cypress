import orangeHRMPage from '../../support/pages/OrangeHRMPage';

describe('Project Akhir: Automation Login, Forgot Pass, Directory (POM + Intercept)', () => {

  // FIX TC-003: Memberitahu Cypress untuk mengabaikan bug internal (error js) dari website OrangeHRM
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    // Membuka URL sebelum tiap test case jalan
    orangeHRMPage.visit();
  });

  // ==========================================
  // FITUR: LOGIN
  // ==========================================
  
  it('TC-001: [Login] Sukses masuk dashboard & Validasi Status 302', () => {
    cy.intercept('POST', '**/auth/validate').as('reqLoginValid');
    
    orangeHRMPage.login('Admin', 'admin123');
    
    // Intercept: Memastikan API merespon dengan status 302 (Redirect ke dashboard)
    cy.wait('@reqLoginValid').its('response.statusCode').should('eq', 302);
    cy.url().should('include', '/dashboard');
  });

  it('TC-002: [Login] Gagal & Validasi Payload Data yang Dikirim', () => {
    cy.intercept('POST', '**/auth/validate').as('reqLoginInvalid');
    
    orangeHRMPage.login('SalahUser', 'salah123');
    
    // Intercept: Memastikan request body (data yang disubmit) memuat teks 'SalahUser'
    cy.wait('@reqLoginInvalid').its('request.body').should('include', 'SalahUser');
  });

  it('TC-003: [Login] Logout Sukses & Validasi Request URL', () => {
    orangeHRMPage.login('Admin', 'admin123');
    
    cy.intercept('GET', '**/auth/logout').as('reqLogout');
    orangeHRMPage.logout();
    
    // Intercept: Memastikan endpoint URL yang di-hit benar-benar endpoint logout
    cy.wait('@reqLogout').its('request.url').should('include', '/auth/logout');
    cy.url().should('include', '/login');
  });


  // ==========================================
  // FITUR: FORGOT PASSWORD
  // ==========================================

  it('TC-004: [Forgot Pass] Buka halaman lupa sandi & Validasi Request Method', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('reqForgotPage');
    
    orangeHRMPage.clickForgotPassword();
    
    // Intercept: Memastikan browser memakai metode GET untuk pindah halaman
    cy.wait('@reqForgotPage').its('request.method').should('eq', 'GET');
  });

  it('TC-005: [Forgot Pass] Submit username reset & Validasi Status Code 302', () => {
    orangeHRMPage.clickForgotPassword();
    
    cy.intercept('POST', '**/auth/requestResetPassword').as('reqReset');
    orangeHRMPage.submitResetPassword('Admin');
    
    // Intercept: Memastikan pengiriman form reset sukses
    cy.wait('@reqReset').its('response.statusCode').should('eq', 302);
    orangeHRMPage.elements.resetSuccessMsg().should('be.visible');
  });

  it('TC-006: [Forgot Pass] Tekan tombol Cancel & Validasi Route kembali ke Login', () => {
    orangeHRMPage.clickForgotPassword();
    
    orangeHRMPage.elements.cancelBtn().click();
    
    // Validasi POM biasa: memastikan tombol cancel mengembalikan user ke URL login
    cy.url().should('include', '/login');
  });


  // ==========================================
  // FITUR: DIRECTORY (DASHBOARD)
  // ==========================================

  it('TC-007: [Directory] Buka menu Directory & Validasi Response Body punya data', () => {
    orangeHRMPage.login('Admin', 'admin123');
    
    cy.intercept('GET', '**/api/v2/directory/employees**').as('reqDirLoad');
    
    orangeHRMPage.goToDirectory();
    
    // Intercept: Memastikan JSON response punya properti 'data' (daftar karyawan)
    cy.wait('@reqDirLoad').its('response.body').should('have.property', 'data');
  });

  it('TC-008: [Directory] Cari berdasarkan nama & Validasi Endpoint Search', () => {
    orangeHRMPage.login('Admin', 'admin123');
    orangeHRMPage.goToDirectory();
    
    // FIX TC-008: Membuat wildcard intercept lebih luas agar aman dari perubahan parameter API
    cy.intercept('GET', '**/api/v2/directory/employees**').as('reqSearchName');
    
    orangeHRMPage.searchEmployeeName('Peter');
    
    // Validasi API berhasil dieksekusi (Status 200 OK)
    cy.wait('@reqSearchName').its('response.statusCode').should('eq', 200);
  });

  it('TC-009: [Directory] Tekan tombol Reset pencarian & Validasi Headers JSON', () => {
    orangeHRMPage.login('Admin', 'admin123');
    orangeHRMPage.goToDirectory();
    
    orangeHRMPage.searchEmployeeName('Peter');
    cy.wait(1500);
    
    cy.intercept('GET', '**/api/v2/directory/employees**').as('reqDirReset');
    orangeHRMPage.elements.resetDirBtn().click();
    
    // Intercept: Memastikan API membalikan reset berformat JSON
    cy.wait('@reqDirReset').its('response.headers').should('have.property', 'content-type').and('include', 'application/json');
  });

  it('TC-010: [Directory] Memastikan UI Directory menampilkan Area Kontainer Data', () => {
    orangeHRMPage.login('Admin', 'admin123');
    orangeHRMPage.goToDirectory();
    
    // FIX TC-010: Memvalidasi area kontainer utama agar tidak error jika terjadi database karyawannya lagi kosong
    cy.get('.orangehrm-paper-container', { timeout: 15000 }).should('be.visible');
  });

});
