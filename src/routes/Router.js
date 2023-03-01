import React, { useEffect, useCallback, useMemo } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

const Router = () => {
  const location = useLocation();
  const history = useHistory();

  const onRedirectCb = useCallback(
    (appState) => {
      history.push(appState?.targetUrl || location.pathname);
    },
    [history, location.pathname]
  );

  useEffect(() => {
    const unregister = history.listen((l, action) => {
      if (action !== "POP") {
        // Scroll to top on navigation change
        window.scrollTo(0, 0);
      }
    });

    return () => unregister();
  }, [history]);

  return (
    <React.StrictMode>
      <Auth0Provider onRedirectCallback={onRedirectCb}></Auth0Provider>
    </React.StrictMode>
  );
};
