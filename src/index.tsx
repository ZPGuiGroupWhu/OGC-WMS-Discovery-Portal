import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import {BrowserRouter, Route} from 'react-router-dom';
import {store,persistor} from './redux/store'
// redux plug-in
import {Provider} from 'react-redux'
// redux-persist plug-in
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
           <BrowserRouter>
              <Route path={`/`} component={App} />
           </BrowserRouter>
        </PersistGate>
   </Provider>
    ,
    document.getElementById('root') as HTMLElement
    
);
registerServiceWorker();