import React, { useEffect, useCallback, lazy, Suspense } from "react";
import { Route, useNavigate, useLocation } from "react-router-dom";
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
  Invoices,
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
  lazy(() => import("../context/AuthContext"))
);

const Router: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onRedirectCb = useCallback(() => {
    navigate("/account/login");
  }, [history]);

  // useEffect(() => {
  //   const unregister = navigate.listen((l, action) => {
  //     if (action !== "POP") {
  //       // Scroll to top on navigation change
  //       window.scrollTo(0, 0);
  //     }
  //   });

  //   return () => unregister();
  // }, [navigate]);

  return (
    <React.StrictMode>
      <FirebaseProvider onRedirectCallback={onRedirectCb}>
        <CustomSwitch>
          <Route
            path={routes.index}
            element={
              <Page>
                <Dashboard />
              </Page>
            }
          />
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.register} element={Register} />
          <Route path={routes.verifyEmail} element={VerifyEmail} />
          <Route path={routes.forgotPassword} Component={ForgotPassword} />
          <Route path={routes.resetPassword} element={ResetPassword} />
          <Route
            path={routes.subsribers}
            element={
              <Page>
                <Subscribers />
              </Page>
            }
          />
          <Route
            path={routes.users}
            element={
              <Page>
                <ListUsers />
              </Page>
            }
          />
          <Route
            path={routes.importUsers}
            element={
              <Page>
                <ImportUsers />
              </Page>
            }
          />
          <Route
            path={routes.expenses}
            element={
              <Page>
                <Expenses />
              </Page>
            }
          />
          <Route path={routes.addEditUsers} element={AddEdit} />
          <Route path={`${routes.addEditUsers}/:id`} element={AddEdit} />
          <Route
            path={routes.plans}
            element={
              <Page>
                <Plans />
              </Page>
            }
          />
          <Route
            path={routes.invoices}
            element={
              <Page>
                <Invoices />
              </Page>
            }
          />
          <Route path="*" element={NotFoundPage} />
        </CustomSwitch>
      </FirebaseProvider>
    </React.StrictMode>
  );
};

export default Router;
