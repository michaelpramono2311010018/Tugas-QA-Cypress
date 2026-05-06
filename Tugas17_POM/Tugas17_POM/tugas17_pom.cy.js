// Import file class POM
import loginPage from '../../support/pages/LoginPage';

describe('Tugas 17: OrangeHRM Login Automation dengan POM (10 Test Cases)', () => {

  beforeEach(() => {
    // Panggil fungsi visit() dari POM sebelum tiap test case jalan
    loginPage.visit();
  });

  it('TC-001: Login sukses dengan Kredensial Valid', () => {
    loginPage.fillUsername('Admin');
    loginPage.fillPassword('admin123');
    loginPage.clickLogin();
    
    // Validasi berhasil masuk ke dashboard
    loginPage.verifyDashboardPage();
  });

  it('TC-002: Login gagal dengan Username Salah', () => {
    loginPage.fillUsername('BukanAdmin');
    loginPage.fillPassword('admin123');
    loginPage.clickLogin();
    
    // Validasi muncul error invalid credentials
    loginPage.verifyErrorCredential();
  });

  it('TC-003: Login gagal dengan Password Salah', () => {
    loginPage.fillUsername('Admin');
    loginPage.fillPassword('PasswordSalah123');
    loginPage.clickLogin();
    
    loginPage.verifyErrorCredential();
  });

  it('TC-004: Login gagal saat Username dan Password dua-duanya salah', () => {
    loginPage.fillUsername('UserNgawur');
    loginPage.fillPassword('PassNgawur');
    loginPage.clickLogin();
    
    loginPage.verifyErrorCredential();
  });

  it('TC-005: Muncul pesan error saat langsung klik login tanpa isi form', () => {
    loginPage.clickLogin();
    
    // Cek pesan 'Required' (untuk user & pass)
    loginPage.elements.requiredMessage().should('have.length', 2);
  });

  it('TC-006: Muncul pesan error saat Username dibiarkan kosong', () => {
    loginPage.fillPassword('admin123');
    loginPage.clickLogin();
    
    loginPage.elements.requiredMessage().should('be.visible').and('contain', 'Required');
  });

  it('TC-007: Muncul pesan error saat Password dibiarkan kosong', () => {
    loginPage.fillUsername('Admin');
    loginPage.clickLogin();
    
    loginPage.elements.requiredMessage().should('be.visible').and('contain', 'Required');
  });

  it('TC-008: Mengarahkan user ke halaman lupa sandi dengan benar', () => {
    loginPage.clickForgotPassword();
    
    // URL berubah ke halaman reset password
    cy.url().should('include', '/requestPasswordResetCode');
  });

  it('TC-009: Memastikan kolom input password tersamarkan (Masked)', () => {
    loginPage.fillPassword('Rahasia123');
    
    // Input password bertipe "password"
    loginPage.verifyPasswordIsMasked();
  });

  it('TC-010: Memastikan Logo Perusahaan tampil dengan baik', () => {
    // Validasi logo terlihat di layar
    loginPage.verifyLogoVisible();
  });

});
