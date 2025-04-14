// src/utils/googleMapsLoader.js
export const GOOGLE_MAPS_API_OPTIONS = {
    id: 'google-map-script', // ensure it's consistent
    version: 'weekly',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    language: 'pt', // or 'en', but make sure it's consistent
    region: 'pt',
    libraries: ['places'], // or add 'geometry', 'maps', etc. if needed
  };
  