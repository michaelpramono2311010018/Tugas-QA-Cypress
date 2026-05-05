describe('Tugas 16: OrangeHRM Login with cy.intercept (10 Test Cases)', () => {

  beforeEach(() => {
    // Membuka halaman login sebelum setiap test case dimulai
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('TC-001: Validasi 1 - Mengecek Response Status Code (302 Redirect)', () => {
    cy.intercept('POST', '**/auth/validate').as('reqLogin');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi 1: Memastikan kode kembalian dari API adalah 302 (berhasil login & dipindahkan halamannya)
    cy.wait('@reqLogin').its('response.statusCode').should('eq', 302);
  });

  it('TC-002: Validasi 2 - Mengecek Request Method (Tipe GET)', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('reqForgot');
    
    cy.get('.orangehrm-login-forgot p').click();

    // Validasi 2: Memastikan saat mengeklik lupa sandi, browser mengirim permintaan dengan metode GET
    cy.wait('@reqForgot').its('request.method').should('eq', 'GET');
  });

  it('TC-003: Validasi 3 - Mengecek Request Body (Data yang dikirim User)', () => {
    cy.intercept('POST', '**/auth/validate').as('reqInvalid');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('PasswordSalah');
    cy.get('button[type="submit"]').click();

    // Validasi 3: Memastikan payload data "PasswordSalah" benar-benar direkam dan dikirim ke server
    cy.wait('@reqInvalid').its('request.body').should('include', 'PasswordSalah');
  });

  it('TC-004: Validasi 4 - Mengecek Request URL Target', () => {
    cy.intercept('POST', '**/auth/validate').as('reqUrl');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi 4: Memastikan target link API yang ditembak memiliki kata "validate" di dalamnya
    cy.wait('@reqUrl').its('request.url').should('include', 'validate');
  });

  it('TC-005: Validasi 5 - Mengecek Response Headers (Mempunyai Location)', () => {
    cy.intercept('POST', '**/auth/validate').as('reqLoc');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi 5: Karena statusnya 302 (Redirect), maka header balasannya wajib memiliki properti 'location'
    cy.wait('@reqLoc').its('response.headers').should('have.property', 'location');
  });

  it('TC-006: Validasi 6 - Mengecek Request Headers (Punya Content-Type)', () => {
    cy.intercept('POST', '**/auth/validate').as('reqHead');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi 6: Memastikan form login mengirimkan header 'content-type' ke server
    cy.wait('@reqHead').its('request.headers').should('have.property', 'content-type');
  });

  it('TC-007: Validasi 7 - Mengecek Response Status Code (200 OK) pada Reset Password', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('reqForgot2');
    
    cy.get('.orangehrm-login-forgot p').click();

    // Validasi 7: Memastikan halaman reset password berhasil dimuat (Status 200 OK)
    cy.wait('@reqForgot2').its('response.statusCode').should('eq', 200);
  });

  it('TC-008: Validasi 8 - Mengecek Arah Redirect pada Invalid Login', () => {
    cy.intercept('POST', '**/auth/validate').as('reqInvalidLoc');
    
    cy.get('input[name="username"]').type('BukanAdmin');
    cy.get('input[name="password"]').type('salah123');
    cy.get('button[type="submit"]').click();

    // Validasi 8: Jika login gagal, server mengarahkan ulang (location) kembali ke halaman 'login'
    cy.wait('@reqInvalidLoc').its('response.headers.location').should('include', 'login');
  });

  it('TC-009: Validasi 9 - Mengecek Object Intercept Memiliki Property Response', () => {
    cy.intercept('POST', '**/auth/validate').as('reqObject');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi 9: Memastikan penyadapan jaringan sukses menangkap object 'response' dari server
    cy.wait('@reqObject').should('have.property', 'response');
  });

  it('TC-010: Validasi 10 - Mengecek URL Endpoint Lupa Sandi', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('reqForgot3');
    
    cy.get('.orangehrm-login-forgot p').click();

    // Validasi 10: Memastikan endpoint URL lupa sandi tepat sasaran
    cy.wait('@reqForgot3').its('request.url').should('include', 'requestPasswordResetCode');
  });

});
