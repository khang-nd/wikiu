import React from 'react';
import Header from '../components/Header';
import ButtonLink from '../components/ButtonLink';
import { Redirect } from 'react-router-dom';

function formatNum(statNum) {
  return statNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function ButtonStat({ name, stat }) {
  let icon;
  switch (name) {
    case 'Articles':
      icon = 'text-file-black';
      break;
    case 'Edits':
      icon = 'pencil';
      break;
    case 'Images':
      icon = 'image';
      break;
    case 'Videos':
      icon = 'video-play';
      break;
    default:
  }
  return (
    <div className="button">
      <div className="icon">
        <i className={'fi fi-' + icon}></i>
      </div>
      <div>
        <div className="name">{name}</div>
        <div className="stat">{formatNum(stat)}</div>
      </div>
    </div>
  );
}

function ButtonTool({ name, click }) {
  let icon;
  switch (name) {
    case 'Downloader':
      icon = 'download';
      break;
    case 'Reader':
      icon = 'book';
      break;
    case 'Say Thanks':
      icon = 'heart-black';
      break;
    default:
  }
  return (
    <ButtonLink click={click}>
      <i className={'fi fi-' + icon}></i>
      <div>{name}</div>
    </ButtonLink>
  );
}

class Dashboard extends React.Component {
  render() {
    if (!window.wiki) return <Redirect to="/" />;
    const { history } = this.props;
    const { domain, lang } = this.props.match.params;
    const {
      wiki: { name, stats, wam_score },
    } = window;
    return (
      <div id="wrapper">
        <Header
          title={name}
          label={`WAM Score: ${parseFloat(wam_score).toFixed(1)}`}
          history={history}
        />
        <h1>
          <i className="fi fi-info-circle"></i> Wiki Info
        </h1>
        <div className="columns columns--25 stats">
          <ButtonStat name="Articles" stat={stats.articles} />
          <ButtonStat name="Edits" stat={stats.edits} />
          <ButtonStat name="Images" stat={stats.images} />
          <ButtonStat name="Videos" stat={stats.videos} />
        </div>
        <h1>
          <i className="fi fi-tools"></i> Utilities
        </h1>
        <div className="columns columns--20 tools">
          <ButtonTool
            name="Downloader"
            click={() => history.push(`/downloader/${domain}/${lang}`)}
          />
          <ButtonTool
            name="Reader"
            click={() => history.push(`/reader/${domain}/${lang}`)}
          />
          <ButtonTool
            name="Say Thanks"
            click={() => history.push(`/thanker/${domain}/${lang}`)}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
