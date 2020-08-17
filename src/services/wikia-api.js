import proxy from './cors-proxy';

class WikiaApi {
  Endpoint = {
    Wikis: {
      ByString: '/Wikis/ByString',
      Details: '/Wikis/Details',
      Top: '/Wikis/List',
    },
  };

  constructor(domain = 'wikia.com') {
    const api = '/api/v1';
    this.url = domain + api;
  }

  query(endpoint, params) {
    return proxy.get(this.url + endpoint, { ...params });
  }

  queryWiki(domain, language = 'en') {
    return new Promise((resolve, reject) => {
      this.query(this.Endpoint.Wikis.ByString, {
        string: domain,
        expand: 1,
        limit: 1,
        lang: language,
        includeDomain: true,
      }).then(
        ({ data: { items } }) => {
          if (!items.length || items[0].domain !== domain) {
            reject('Not a valid wiki');
            return;
          }
          resolve(items[0]);
        },
        () => reject('Request to query wiki info failed!')
      );
    });
  }
}

export default WikiaApi;
