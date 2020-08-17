import React from 'react';
import MwApi from '../services/mw-api';
import WikiaApi from '../services/wikia-api';
import { isEnter } from '../utils';
import ButtonLink from '../components/ButtonLink';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    window.wiki = null;
    this.domain = React.createRef();
    this.state = { isLoading: true, lang: 'en' };
  }

  componentDidMount() {
    if (window.lang) {
      this.setState({ languages: window.lang, isLoading: false });
    } else {
      new MwApi().queryLanguages().then(({ data }) => {
        const { languages } = data.query;
        window.lang = languages;
        this.setState({ languages, isLoading: false });
      });
    }
  }

  proceed() {
    const { isLoading, lang } = this.state;
    let domain = this.domain.current.value;
    if (isLoading) return;
    if (!domain) {
      this.setState({ error: 'Please enter wiki topic!' });
      return;
    }
    if (/[^a-zA-Z0-9-]/.test(domain)) {
      this.setState({ error: 'Invalid input!' });
      return;
    }
    this.setState({ isLoading: true });
    domain = domain.toLowerCase() + '.fandom.com';
    new WikiaApi().queryWiki(domain, lang).then(
      (data) => {
        window.wiki = data;
        this.props.history.push(`dashboard/${domain}/${lang}`);
      },
      (message) => {
        this.setState({ isLoading: false, error: message });
      }
    );
  }

  render() {
    const { isLoading, languages, lang, error } = this.state;
    return (
      <>
        <div id="title">
          <div>WikiU</div>
          <div>Utilities for Fandom Wikis</div>
        </div>
        <div id="main">
          {languages ? (
            <select
              defaultValue={lang}
              onChange={({ target }) => this.setState({ lang: target.value })}
            >
              {languages.map((lang, i) => (
                <option key={i} value={lang.code}>
                  {lang['*']}
                </option>
              ))}
            </select>
          ) : (
            <div className="placeholder__control">
              <div className="loader"></div>
            </div>
          )}
          <div className="text">
            <input
              type="text"
              placeholder="topic"
              ref={this.domain}
              onKeyDown={(e) => (isEnter(e) ? this.proceed() : null)}
            />
            <label>.fandom.com</label>
          </div>
          <button
            className="ripple button--primary"
            onClick={this.proceed.bind(this)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>
          <center className={'text--error' + (error ? ' visible' : '')}>
            {error ? error : '&nbsp;'}
          </center>
          <center>or</center>
          <ButtonLink click={() => this.props.history.push('/browse')}>
            Browse wikis
          </ButtonLink>
        </div>
        <small id="copyright">
          <div>
            Content is made available by Fandom under their licensing policy
          </div>
          <div>
            WikiU is in no way affiliated with Fandom and do not claim any
            copyright of the content
          </div>
        </small>
      </>
    );
  }
}

export default Welcome;
