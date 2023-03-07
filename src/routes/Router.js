import React, { useEffect, useCallback, lazy, Suspense } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { PrivateRoute, Alert } from "@/components";
import { AppSidebar } from "@/components/ui/app_sidebar/AppSidebar";
import { Dashboard } from "@/pages/dashboard";
import { Account } from "@/pages/account";
import { Admin } from "@/pages/admin";
import { TopNavigation } from "@/components";
import { CustomSwitch } from "@/components";
import "react-notifications-component/dist/theme.css";
import { Container } from "semantic-ui-react";

const withSuspense = (WrappedComponent) => {
  return (props) => {
    return (
      <Suspense fallback={<></>}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
};

export const FirebaseProvider = withSuspense(
  lazy(() => import("../components/FirebaseAuth/FirebaseAuthProvider"))
);

const Router = ({ trans }) => {
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
      <FirebaseProvider onRedirectCallback={onRedirectCb}>
        <AppSidebar>
          <Alert />
          <TopNavigation i18n={trans} />
          <Container fluid={true} className="resp__container">
            <CustomSwitch>
              <PrivateRoute exact path="/dashboard" comp={Dashboard} />
              <Route path="/account">
                <Account />
              </Route>
              <PrivateRoute path="/admin">
                <Admin />
              </PrivateRoute>
              <Redirect from="*" to="/dashboard" />
            </CustomSwitch>
          </Container>
        </AppSidebar>
      </FirebaseProvider>
    </React.StrictMode>
  );
};

export default Router;
