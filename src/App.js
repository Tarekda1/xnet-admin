import React, { useCallback } from "react";
import "./App.less";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { store } from "./store";

function App({ trans }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router trans={trans} />
      </BrowserRouter>
    </Provider>
  );
}

export { App };
