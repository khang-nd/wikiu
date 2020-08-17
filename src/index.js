import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './css/uxwing/css/uxwing-iconsfont.min.css';
import './css/master.scss';
import './css/neumorphism.scss';
import './css/utils.scss';

const root = document.getElementById('root');
root.classList.add('neumorphism');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
