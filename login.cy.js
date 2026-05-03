describe('OrangeHRM Login Feature Automation (10 Test Cases)', () => {

  // Hook beforeEach dijalankan sebelum setiap 'it' block dimulai
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  // --- POSITIVE TEST CASES ---

  it('TC-001: [Positive] Login berhasil dengan Kredensial Valid', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Assertion: URL berubah dan header Dashboard muncul
    cy.url().should('include', '/dashboard');
    cy.get('header .oxd-topbar-header-title h6').should('have.text', 'Dashboard');
  });

  it('TC-002: [Positive] Keamanan input password tersamarkan (Masked)', () => {
    cy.get('input[name="password"]').type('rahasia123');
    // Assertion: Memastikan atribut elemen adalah 'password'
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('TC-003: [Positive] Link "Forgot your password?" berfungsi/muncul', () => {
    // Assertion: Memastikan teks lupa sandi tampil di layar
    cy.get('.orangehrm-login-forgot p').should('be.visible').and('contain', 'Forgot your password?');
  });

  it('TC-004: [Positive] Logo perusahaan (OrangeHRM) muncul di halaman login', () => {
    // Assertion: Memastikan gambar logo dirender oleh browser
    cy.get('img[alt="company-branding"]').should('be.visible');
  });

  // --- NEGATIVE TEST CASES (KREDENSIAL SALAH) ---

  it('TC-005: [Negative] Login gagal dengan Username Valid & Password Invalid', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salah123');
    cy.get('button[type="submit"]').click();
    
    // Assertion: Alert error muncul
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('TC-006: [Negative] Login gagal dengan Username Invalid & Password Valid', () => {
    cy.get('input[name="username"]').type('BukanAdmin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Assertion: Alert error muncul
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('TC-007: [Negative] Login gagal dengan Username & Password Keduanya Salah', () => {
    cy.get('input[name="username"]').type('Salah');
    cy.get('input[name="password"]').type('salah123');
    cy.get('button[type="submit"]').click();
    
    // Assertion: Alert error muncul
    cy.contains('Invalid credentials').should('be.visible');
  });

  // --- NEGATIVE TEST CASES (INPUT KOSONG) ---

  it('TC-008: [Negative] Error saat Username dibiarkan kosong', () => {
    // Hanya mengisi password
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Assertion: Teks "Required" muncul
    cy.contains('Required').should('be.visible');
  });

  it('TC-009: [Negative] Error saat Password dibiarkan kosong', () => {
    // Hanya mengisi username
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    
    // Assertion: Teks "Required" muncul
    cy.contains('Required').should('be.visible');
  });

  it('TC-010: [Negative] Error saat Username & Password Keduanya kosong', () => {
    // Langsung klik tombol submit tanpa mengisi apa pun
    cy.get('button[type="submit"]').click();
    
    // Assertion: Terdapat 2 tulisan "Required" (satu untuk user, satu untuk pass)
    cy.get('.oxd-input-field-error-message').should('have.length', 2);
  });

});