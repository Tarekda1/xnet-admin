import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { envVars } from "config/constants";
import Router from "./routes/Router";
import { store } from "./store";
import "./App.scss";

const App: React.FC = () => {
  // Validate env vars
  useEffect(() => {
    const missingConstants = Object.keys(envVars)
      .map((key) => (!envVars[key as keyof typeof envVars] ? key : false))
      .filter(Boolean);

    if (missingConstants.length > 0) {
      throw new Error(`Missing constants ${missingConstants.join(", ")}`);
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
};

export { App };
