import React from 'react';
import { HashRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import Downloader from './views/Downloader';
import Thanker from './views/Thanker';
import Settings from './views/Settings';
import Welcome from './views/Welcome';
import WikiBrowser from './views/WikiBrowser';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <Router hashType="noslash">
      <ul id="navigation">
        <li>
          <NavLink to="/" activeClassName="active" className="ripple" exact>
            <i className="fi fi-home"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/browse" activeClassName="active" className="ripple">
            <i className="fi fi-search"></i> Browse
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" activeClassName="active" className="ripple">
            <i className="fi fi-setting"></i> Settings
          </NavLink>
        </li>
      </ul>
      <div id="content">
        <Switch>
          <Route path="/" exact component={Welcome} />
          <Route path="/browse" component={WikiBrowser} />
          <Route path="/dashboard/:domain/:lang" component={Dashboard} />
          <Route path="/downloader/:domain/:lang" component={Downloader} />
          <Route path="/thanker/:domain/:lang" component={Thanker} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
