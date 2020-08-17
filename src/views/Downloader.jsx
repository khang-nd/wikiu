import React from 'react';
import MwApi from '../services/mw-api';
import Header from '../components/Header';
import Popup from '../components/Popup';
import CircProgressBar from '../components/CircProgressBar';
import InfiniteScoller from 'react-infinite-scroller';
import AutoSuggest from 'react-autosuggest';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { isEnter } from '../utils';

function GalleryItem({ click, size, caption, children }) {
  return (
    <div className="gallery__item" onClick={click}>
      <div className="gallery__img">
        {children}
        <div className="downloadable centered">
          <i className="fi fi-round-black-bottom-arrow"></i>
        </div>
      </div>
      <div className="gallery__caption" style={{ width: size }} title={caption}>
        {caption}
      </div>
    </div>
  );
}

class Downloader extends React.Component {
  initState = {
    images: [],
    hasMore: true,
    isLoading: true,
    downloaded: null,
    from: null,
  };

  filterType = {
    SORT: 0,
    NAME: 1,
    PAGE: 2,
  };

  constructor(props) {
    super(props);
    const { domain, lang } = props.match.params;
    this.api = new MwApi(domain + '/' + lang);
    this.thumbSize = window.innerWidth < 500 ? 100 : 180;
    this.state = {
      ...this.initState,
      showFilter: true,
      filterType: this.filterType.NAME,
      image: '',
      page: '',
      pageId: '',
      suggestions: [],
      order: this.api.SortOrder.Asc,
    };
  }

  loadImages() {
    const { lang } = this.props.match.params;
    const {
      thumbSize: size,
      state: { order, from, image, pageId, filterType },
    } = this;
    const query =
      filterType === this.filterType.NAME
        ? this.api.queryImagesByName(image, from, order)
        : this.api.queryImagesFromPage(pageId, from, order);
    query.then(({ allimages, from }) => {
      allimages = allimages.map((img) => {
        const { origin, pathname } = new URL(img.url);
        return {
          ...img,
          url: {
            original: img.url,
            thumbnail: `${origin}${pathname}/top-crop-down/width/${size}/height/${size}${
              lang === 'en' ? '' : '?path-prefix=' + lang
            }`,
          },
        };
      });
      const newState = {
        images: [...this.state.images, ...allimages],
        isLoading: false,
      };
      this.setState(
        from ? { from, ...newState } : { hasMore: false, ...newState }
      );
    });
  }

  filter(type, value) {
    const {
      filterType,
      state: { order },
    } = this;
    let filter;
    switch (type) {
      case filterType.NAME:
        filter = { image: value };
        break;
      case filterType.PAGE:
        filter = { pageId: value };
        break;
      default:
        if (order === value) return;
        filter = { order: value };
    }
    this.setState({
      ...this.initState,
      ...filter,
    });
  }

  downloadAll() {
    const { images } = this.state;
    if (!images.length) return;

    const promises = [];
    const zip = new JSZip();
    let progress = 0;

    images.forEach(({ url, name }) => {
      let resolve, reject;
      promises.push(
        new Promise((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        })
      );
      JSZipUtils.getBinaryContent(url.original, (err, data) => {
        if (err) reject(err);
        else {
          zip.file(name, data, { binary: true });
          this.setState({ downloaded: ++progress });
          resolve();
        }
      });
    });
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'images');
        setTimeout(() => this.setState({ downloaded: 0 }), 2500);
      });
    });
  }

  loadSuggestions(value) {
    clearTimeout(this.wait);
    this.setState({ page: value });
    if (value === this.state.page) {
      this.setState({ suggestions: this.state.cachedSuggestions });
    } else {
      this.wait = setTimeout(
        () =>
          this.api.queryPages(value).then((response) => {
            const { allpages } = response.data.query;
            this.setState({
              suggestions: allpages,
              cachedSuggestions: allpages,
            });
          }),
        300
      );
    }
  }

  render() {
    const {
      thumbSize,
      filterType,
      api: { SortOrder },
      props: { history },
      state: {
        isLoading,
        images,
        hasMore,
        downloaded,
        order,
        showFilter,
        suggestions,
        page,
      },
    } = this;
    return (
      <div id="wrapper">
        <Header
          title="Downloader"
          desc="Browse, search, or download images"
          history={history}
        />
        <div className="sticky--top">
          <fieldset
            disabled={isLoading}
            style={{ display: showFilter ? '' : 'none' }}
          >
            <div className="columns columns--25">
              <div>
                <input
                  type="text"
                  placeholder="Filter by name"
                  onKeyUp={(e) => {
                    if (isEnter(e)) {
                      const filterType = this.filterType.NAME;
                      this.setState({ filterType, from: null });
                      this.filter(filterType, e.target.value);
                    }
                  }}
                />
              </div>
              <AutoSuggest
                suggestions={suggestions}
                getSuggestionValue={(page) => page.title}
                onSuggestionsFetchRequested={({ value }) =>
                  this.loadSuggestions(value)
                }
                onSuggestionsClearRequested={() =>
                  this.setState({ suggestions: [] })
                }
                onSuggestionSelected={(_, { suggestion }) => {
                  const filterType = this.filterType.PAGE;
                  this.setState({ filterType, from: null });
                  this.filter(filterType, suggestion.pageid);
                }}
                renderSuggestion={(page) => (
                  <div className="page">{page.title}</div>
                )}
                inputProps={{
                  placeholder: 'Filter by page use',
                  value: page,
                  onChange: (_, { newValue }) =>
                    this.setState({ page: newValue }),
                }}
              />
              <div className="button__group column--s">
                <button
                  className={`ripple${
                    order === SortOrder.Asc ? ' active' : ''
                  }`}
                  onClick={() => this.filter(filterType.SORT, SortOrder.Asc)}
                >
                  <i className="fi fi-ascending-filter"></i>
                </button>
                <button
                  className={`ripple${
                    order === SortOrder.Desc ? ' active' : ''
                  }`}
                  onClick={() => this.filter(filterType.SORT, SortOrder.Desc)}
                >
                  <i className=" fi fi-descending-filter"></i>
                </button>
              </div>
              <div className="column--m">
                <button
                  className="ripple button--primary"
                  onClick={this.downloadAll.bind(this)}
                >
                  Download {images.length} Images
                </button>
              </div>
            </div>
          </fieldset>
          <div
            className="filter__toggle centered sticky--top"
            onClick={() => this.setState({ showFilter: !showFilter })}
          >
            <i
              className={
                'fi ' + (showFilter ? 'fi-angle-top' : 'fi-angle-bottom')
              }
            ></i>
          </div>
        </div>
        {downloaded ? (
          <Popup>
            <CircProgressBar
              progressText="Zipping files"
              completeText="Starting download"
              value={downloaded}
              max={images.length}
            />
          </Popup>
        ) : null}
        <InfiniteScoller
          className="gallery"
          loadMore={this.loadImages.bind(this)}
          hasMore={hasMore}
          loader={
            <div
              key={null}
              className="centered"
              style={{ width: thumbSize, height: thumbSize }}
            >
              <div className="loader"></div>
            </div>
          }
        >
          {images.map(({ url: { original, thumbnail }, name }, i) => (
            <GalleryItem
              key={i}
              caption={name}
              size={thumbSize}
              click={() => saveAs(original, name)}
            >
              <img src={thumbnail} alt={name} />
            </GalleryItem>
          ))}
        </InfiniteScoller>
      </div>
    );
  }
}

export default Downloader;
