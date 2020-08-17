import axios from 'axios';
export default {
  get: (url, params) =>
    axios.get('https://cors-mediawiki.herokuapp.com', {
      headers: {
        'Target-URL': url.startsWith('http') ? url : 'https://' + url,
      },
      params,
    }),
};
