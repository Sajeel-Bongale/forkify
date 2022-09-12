import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const button = e.target.closest('.btn--inline');
      if(!button) return;
      const gotoPage = +button.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    // Page 1 and other pages
    if (currentPage === 1 && numberOfPages > 1) {
      return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Last Page
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `
    }

    // Middle Pages
    if (currentPage < numberOfPages) {
      return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }

    // Page 1 and no other page
    return '';
  }
}

export default new PaginationView();
