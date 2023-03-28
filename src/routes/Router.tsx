import React, { useEffect, useCallback, lazy, Suspense } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { PrivateRoute, CustomSwitch } from "components";
import Page from "components/ui/page/page";
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
  Dashboard,
  Plans,
} from "./pages";
import routes from "./routes";
import "react-notifications-component/dist/theme.css";

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

const Router: React.FC = () => {
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
          <PrivateRoute
            exact
            path={routes.index}
            render={() => (
              <Page>
                <Dashboard />
              </Page>
            )}
          />
          <Route exact path={routes.login} component={Login} />
          <Route exact path={routes.register} component={Register} />
          <Route exact path={routes.verifyEmail} component={VerifyEmail} />
          <PrivateRoute
            exact
            path={routes.forgotPassword}
            component={ForgotPassword}
          />
          <PrivateRoute path={routes.resetPassword} component={ResetPassword} />
          <PrivateRoute
            exact
            path={routes.subsribers}
            render={() => (
              <Page>
                <Subscribers />
              </Page>
            )}
          />
          <PrivateRoute
            exact
            path={routes.users}
            render={() => (
              <Page>
                <ListUsers />
              </Page>
            )}
          />
          <PrivateRoute
            exact
            path={routes.importUsers}
            render={() => (
              <Page>
                <ImportUsers />
              </Page>
            )}
          />
          <Route
            exact
            path={routes.expenses}
            render={() => (
              <Page>
                <Expenses />
              </Page>
            )}
          />
          <Route exact path={routes.addEditUsers} component={AddEdit} />
          <Route
            exact
            path={`${routes.addEditUsers}/:id`}
            component={AddEdit}
          />
          <Route
            exact
            path={routes.plans}
            render={() => (
              <Page>
                <Plans />
              </Page>
            )}
          />
          <Route path="*" component={NotFoundPage} />
        </CustomSwitch>
      </FirebaseProvider>
    </React.StrictMode>
  );
};

export default Router;
