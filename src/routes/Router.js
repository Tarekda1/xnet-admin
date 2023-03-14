import React, { useEffect, useCallback, lazy, Suspense } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { PrivateRoute, Alert } from "../components";
import { Dashboard } from "../pages/dashboard";
import { CustomSwitch } from "../components";
import Page from "../components/ui/page/page";
import "react-notifications-component/dist/theme.css";
import {
  Subscribers,
  NotFoundPage,
  ImportUsers,
  Expenses,
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  ListUsers,
  AddEdit,
} from "./pages";

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
        <CustomSwitch>
          <PrivateRoute exact path="/dashboard" comp={Dashboard} />
          <Route exact path={`/account/login`} component={Login} />
          <Route exact path={`/account/register`} component={Register} />
          <Route exact path={`/account/verify-email`} component={VerifyEmail} />
          <Route
            exact
            path={`/account/forgot-password`}
            component={ForgotPassword}
          />
          <Route path={`/account/reset-password`} component={ResetPassword} />
          <Route
            exact
            path="/admin/subscribers"
            render={() => (
              <Page>
                <Subscribers />
              </Page>
            )}
          />
          <Route
            exact
            path="/admin/users"
            render={() => (
              <Page>
                <ListUsers />
              </Page>
            )}
          />
          <Route
            exact
            path="/admin/importusers"
            render={() => (
              <Page>
                <ImportUsers />
              </Page>
            )}
          />
          <Route exact path="/admin/expenses" component={Expenses} />
          <Route exact path="/admin/users/add" component={AddEdit} />
          <Route exact path="/admin/users/edit/:id" component={AddEdit} />
          <Route path="*" component={NotFoundPage} />
        </CustomSwitch>
      </FirebaseProvider>
    </React.StrictMode>
  );
};

export default Router;
