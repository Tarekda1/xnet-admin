import React, { Suspense } from "react";
import ReactDOM, { render } from "react-dom";
import "semantic-ui-css/semantic.min.css";
import { App } from "./App";

// ReactDOM.render(
//   <Suspense fallback={null}>
//     <App />
//   </Suspense>,
//   document.getElementById("root")
// );

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Suspense fallback={null}>
    <App />
  </Suspense>
);
