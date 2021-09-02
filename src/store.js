import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
import storage from "redux-persist/lib/storage";

const initialState = {};

const persistConfig = {
  key: "root",
  storage: storage,
  //blacklist: [ 'internet_users' ]
};
const pReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk, logger];

const store = createStore(
  pReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export { persistor, store };
