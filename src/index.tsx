import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import {BrowserRouter, Route} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
      <Route path={`/`} component={App} />
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();