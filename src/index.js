import React, { Suspense } from "react";
import { Router } from "react-router-dom";
import ReactDOM, { render } from "react-dom";
import { history } from "./_helpers";
import { accountService } from "./_services";
import "@babel/polyfill";
import { App } from "./App";
import i18n from "./Translation";

ReactDOM.render(
  <Suspense fallback={null}>
    <App trans={i18n} />
  </Suspense>,
  document.getElementById("root")
);
