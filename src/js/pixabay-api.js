import axios from 'axios';

const API_KEY = '58436870-5e82bf0698eaeb441307a87a7'; 
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true, 
      page: page,
      per_page: 15,
    },
  });

  return response.data;
}