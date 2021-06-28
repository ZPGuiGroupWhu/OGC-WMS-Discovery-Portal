// redux plug-in
import rootReducer from './reducer'
import {createStore} from 'redux'
// redux-persist plug-in
import {persistStore,persistReducer} from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

// configure the storage (redux)
const storageConfig={
    key:'root',
    storage:storageSession,  // define store mechanism
    // conveyQueryParReducer and conveyVisibleReducer can not write in the local store.
    blacklist:['conveyQueryParReducer','conveyVisibleReducer'],
}
// put rootReducer into persist
const myPersistReducer=persistReducer(storageConfig,rootReducer);
// create store
export const store = createStore(myPersistReducer);
// persist the store
export const persistor =persistStore(store);

