import proxy from './cors-proxy';

class MwApi {
  SortOrder = {
    Asc: 0,
    Desc: 1,
  };

  constructor(domain = 'c.fandom.com') {
    const api = '/api.php';
    this.url = domain + api;
  }

  query(params) {
    return proxy.get(this.url, {
      action: 'query',
      format: 'json',
      ...params,
    });
  }

  queryLanguages() {
    return this.query({
      meta: 'siteinfo',
      siprop: 'languages',
    });
  }

  queryPages(pageName) {
    return this.query({
      list: 'allpages',
      apprefix: pageName,
      apfilterredir: 'nonredirects',
      aplimit: 5,
    });
  }

  queryImages(from, params) {
    return this.query({
      list: 'allimages',
      aiprop: 'url|mediatype',
      aifrom: from,
      ailimit: 20,
      ...params,
    }).then(({ data }) => {
      const { query, 'query-continue': queryContinue } = data;
      return {
        from: queryContinue ? queryContinue.allimages.aifrom : null,
        allimages: query.allimages
          .filter(
            (img) => img.mediatype !== 'AUDIO' && img.mediatype !== 'VIDEO'
          )
          .map((img) => ({
            name: img.title.replace('File:', ''),
            url: img.url,
          })),
      };
    });
  }

  queryImagesByName(name, from, order = this.SortOrder.Asc) {
    return this.queryImages(from, {
      aiprefix: name,
      aidir: order === this.SortOrder.Asc ? 'ascending' : 'descending',
    });
  }

  queryImagesFromPage(pageId, from, order = this.SortOrder.Asc) {
    return this.query({
      redirects: '',
      pageids: pageId,
      generator: 'images',
      gimlimit: 20,
      gimcontinue: from,
      gimdir: order === this.SortOrder.Asc ? 'ascending' : 'descending',
      prop: 'imageinfo',
      iiprop: 'url|mediatype',
    }).then(({ data }) => {
      const { query, 'query-continue': queryContinue } = data;
      console.log("MwApi -> queryImagesFromPage -> queryContinue", queryContinue)
      return {
        from: queryContinue ? queryContinue.images.gimcontinue : null,
        allimages: Object.values(query.pages)
          .filter(
            (page) =>
              page.imageinfo &&
              page.mediatype !== 'AUDIO' &&
              page.mediatype !== 'VIDEO'
          )
          .map((page) => ({
            name: page.title.replace('File:', ''),
            url: page.imageinfo[0].url,
          })),
      };
    });
  }
}

export default MwApi;
