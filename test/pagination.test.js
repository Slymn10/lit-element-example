import {html, fixture, expect} from '@open-wc/testing';
import {stub} from 'sinon';
import '../src/components/common/pagination.js';

suite('Pagination Component', () => {
  let tStub;

  setup(() => {
    // Mock translation function
    tStub = stub().returnsArg(0);
    window.t = tStub;
  });

  teardown(() => {
    delete window.t;
  });

  test('is defined', () => {
    const el = document.createElement('app-pagination');
    expect(el).to.be.instanceOf(window.customElements.get('app-pagination'));
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);

    expect(el.currentPage).to.equal(1);
    expect(el.totalPages).to.equal(1);
    expect(el.visiblePageCount).to.equal(5);
  });

  test('renders pagination structure', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 1;
    el.totalPages = 5;
    await el.updateComplete;

    const pagination = el.shadowRoot.querySelector('.pagination');
    const prevButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:first-child'
    );
    const nextButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:last-child'
    );
    const pageButtons = el.shadowRoot.querySelectorAll(
      '.page-button:not(.arrow-button)'
    );

    expect(pagination).to.exist;
    expect(prevButton).to.exist;
    expect(nextButton).to.exist;
    expect(pageButtons.length).to.equal(5); // 5 page buttons for 5 total pages
  });

  test('disables previous button on first page', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 1;
    el.totalPages = 5;
    await el.updateComplete;

    const prevButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:first-child'
    );
    expect(prevButton.classList.contains('disabled')).to.be.true;
    expect(prevButton.disabled).to.be.true;
  });

  test('disables next button on last page', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 5;
    el.totalPages = 5;
    await el.updateComplete;

    const nextButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:last-child'
    );
    expect(nextButton.classList.contains('disabled')).to.be.true;
    expect(nextButton.disabled).to.be.true;
  });

  test('highlights current page', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 3;
    el.totalPages = 5;
    await el.updateComplete;

    const pageButtons = el.shadowRoot.querySelectorAll(
      '.page-button:not(.arrow-button)'
    );
    const activeButton = Array.from(pageButtons).find((btn) =>
      btn.classList.contains('active')
    );

    expect(activeButton).to.exist;
    expect(activeButton.textContent.trim()).to.equal('3');
  });

  test('fires page-change event when clicking page button', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 1;
    el.totalPages = 5;
    await el.updateComplete;

    let eventDetail = null;
    el.addEventListener('page-change', (e) => {
      eventDetail = e.detail;
    });

    const pageButtons = el.shadowRoot.querySelectorAll(
      '.page-button:not(.arrow-button)'
    );
    const thirdPageButton = Array.from(pageButtons).find(
      (btn) => btn.textContent.trim() === '3'
    );

    if (thirdPageButton) {
      thirdPageButton.click();
      expect(eventDetail).to.not.be.null;
      expect(eventDetail.page).to.equal(3);
    }
  });

  test('fires page-change event when clicking next button', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 2;
    el.totalPages = 5;
    await el.updateComplete;

    let eventDetail = null;
    el.addEventListener('page-change', (e) => {
      eventDetail = e.detail;
    });

    const nextButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:last-child'
    );
    nextButton.click();

    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(3);
  });

  test('fires page-change event when clicking previous button', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 3;
    el.totalPages = 5;
    await el.updateComplete;

    let eventDetail = null;
    el.addEventListener('page-change', (e) => {
      eventDetail = e.detail;
    });

    const prevButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:first-child'
    );
    prevButton.click();

    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(2);
  });

  test('does not fire event when clicking disabled buttons', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 1;
    el.totalPages = 5;
    await el.updateComplete;

    let eventFired = false;
    el.addEventListener('page-change', () => {
      eventFired = true;
    });

    const prevButton = el.shadowRoot.querySelector(
      '.pagination .arrow-button:first-child'
    );
    prevButton.click();

    expect(eventFired).to.be.false;
  });

  test('does not fire event when clicking current page', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 3;
    el.totalPages = 5;
    await el.updateComplete;

    let eventFired = false;
    el.addEventListener('page-change', () => {
      eventFired = true;
    });

    const pageButtons = el.shadowRoot.querySelectorAll(
      '.page-button:not(.arrow-button)'
    );
    const currentPageButton = Array.from(pageButtons).find((btn) =>
      btn.classList.contains('active')
    );
    if (currentPageButton) {
      currentPageButton.click();
    }

    expect(eventFired).to.be.false;
  });

  test('getVisiblePages returns all pages when total <= visible count', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 2;
    el.totalPages = 3;
    el.visiblePageCount = 5;

    const visiblePages = el.getVisiblePages();
    expect(visiblePages).to.deep.equal([1, 2, 3]);
  });

  test('getVisiblePages includes ellipsis for large page counts', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 5;
    el.totalPages = 10;
    el.visiblePageCount = 3;

    const visiblePages = el.getVisiblePages();
    expect(visiblePages).to.include(1);
    expect(visiblePages).to.include('...');
    expect(visiblePages).to.include(10);
    expect(visiblePages).to.include(5);
  });

  test('goToPage method works correctly', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 2;
    el.totalPages = 5;

    let eventDetail = null;
    el.addEventListener('page-change', (e) => {
      eventDetail = e.detail;
    });

    el.goToPage(4);

    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(4);
  });

  test('goToPage does not work for invalid pages', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 2;
    el.totalPages = 5;

    let eventFired = false;
    el.addEventListener('page-change', () => {
      eventFired = true;
    });

    // Try invalid pages
    el.goToPage(0);
    el.goToPage(6);
    el.goToPage(2); // current page

    expect(eventFired).to.be.false;
  });

  test('renders ellipsis correctly', async () => {
    const el = await fixture(html`<app-pagination></app-pagination>`);
    el.currentPage = 5;
    el.totalPages = 20;
    el.visiblePageCount = 5;
    await el.updateComplete;

    const ellipsis = el.shadowRoot.querySelectorAll('.ellipsis');
    expect(ellipsis.length).to.be.greaterThan(0);

    const ellipsisText = Array.from(ellipsis).map((el) =>
      el.textContent.trim()
    );
    expect(ellipsisText).to.include('...');
  });
});
