import React, { Suspense } from "react";
import ReactDOM, { render } from "react-dom";
import "@babel/polyfill";
import { App } from "./App";
import i18n from "./Translation";

ReactDOM.render(
  <Suspense fallback={null}>
    <App trans={i18n} />
  </Suspense>,
  document.getElementById("root")
);
