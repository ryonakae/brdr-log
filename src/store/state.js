'use strict'

import axios from 'axios'

export default {
  pageTitle: '',
  siteTitle: document.title,
  siteUrl: location.protocol + '//' + location.host,
  allPostData: [],
  currentPostData: {},
  perPage: 10,
  perPageMobile: 6,
  loadedPostCount: 0,
  infiniteScrollLock: false,
  isWebfontLoaded: false,
  isNotFound: false,
  isLoading: true,
  isFiltered: false,
  filteredCategory: '',
  client: axios.create(),
  isPreview: window.wpApiSettings.is_preview,
  nonce: window.wpApiSettings.nonce,
  isUserLoggedIn: window.wpApiSettings.is_logged_in
}