import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import * as serviceWorker from './misc/service-worker';

const { NODE_ENV } = process.env;

const root = document.getElementById('root');

function render() {
  // eslint-disable-next-line global-require
  const App = require('./components/App').default;

  ReactDOM.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>,
    root,
  );
}

render();

if (
  typeof NODE_ENV !== 'undefined' &&
  NODE_ENV !== 'production' &&
  NODE_ENV !== 'test' &&
  module.hot
) {
  module.hot.accept('./components/App.jsx', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
