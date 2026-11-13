import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;


hideLoadMoreButton();


searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  currentQuery = searchInput.value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  currentPage = 1;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        maxWidth: '430px',
      });
      return;
    }

    createGallery(data.hits);

    
    if (totalHits > 15) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    
      if (totalHits > 0) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});


loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const cardHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const totalLoaded = currentPage * 15;
    if (totalLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error loading more images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images. Please try again!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});