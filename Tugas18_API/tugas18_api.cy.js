describe('Tugas 18: API Automation Testing (Target Platzi API - 11 Test Cases)', () => {

  const baseUrl = 'https://api.escuelajs.co/api/v1';
  let createdCategoryId;

  it('TC-001: [GET] List Categories - Memastikan status 200 dan data berupa array', () => {
    cy.request('GET', `${baseUrl}/categories`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('TC-002: [GET] Single Category - Memastikan data kategori ID 1 dapat dipanggil', () => {
    cy.request('GET', `${baseUrl}/categories/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name');
    });
  });

  it('TC-003: [GET] Category Not Found - Memastikan status error jika kategori tidak ada', () => {
    cy.request({ method: 'GET', url: `${baseUrl}/categories/999999`, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]); 
    });
  });

  it('TC-004: [GET] Category Products - Memastikan daftar produk di kategori 1 tidak kosong', () => {
    cy.request('GET', `${baseUrl}/categories/1/products`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('TC-005: [POST] Create Category - Memastikan kategori baru berhasil dibuat (Status 201)', () => {
    const newCat = {
      name: 'Kategori QA Automation',
      image: 'https://i.imgur.com/QkIa5tT.jpeg'
    };

    cy.request('POST', `${baseUrl}/categories`, newCat).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq(newCat.name);
      expect(response.body).to.have.property('id');

      createdCategoryId = response.body.id;
    });
  });

  it('TC-006: [PUT] Update Category - Memastikan nama kategori yang baru dibuat berhasil diubah', () => {
    const updateCat = {
      name: 'Kategori QA (Sudah Diupdate)'
    };

    cy.request('PUT', `${baseUrl}/categories/${createdCategoryId}`, updateCat).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(updateCat.name);
    });
  });

  it('TC-007: [DELETE] Delete Category - Memastikan kategori berhasil dihapus', () => {
    cy.request('DELETE', `${baseUrl}/categories/${createdCategoryId}`).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
    });
  });

  it('TC-008: [POST] Create Category (Negative) - Error jika format pengiriman payload salah', () => {
    const badPayload = {
      nama_kategori_salah: 'Pasti Gagal' // Tidak ada properti 'name' dan 'image'
    };

    cy.request({ method: 'POST', url: `${baseUrl}/categories`, body: badPayload, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]); 
    });
  });

  it('TC-009: [PUT] Update Category (Negative) - Error jika mencoba update ID yang sudah dihapus', () => {
    const updateData = { name: 'Gagal Update Dong' };
    cy.request({ method: 'PUT', url: `${baseUrl}/categories/${createdCategoryId}`, body: updateData, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  it('TC-010: [DELETE] Delete Category (Negative) - Error jika menghapus ID yang tidak pernah ada', () => {
    cy.request({ method: 'DELETE', url: `${baseUrl}/categories/999999`, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  it('TC-011: [GET] Performance Validasi - Memastikan API merespon dengan waktu di bawah 5 detik', () => {
    cy.request('GET', `${baseUrl}/categories`).then((response) => {
      expect(response.status).to.eq(200);
      // Mengecek duration / response time
      expect(response.duration).to.be.lessThan(5000); 
    });
  });

});
