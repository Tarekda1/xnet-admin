import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.less";
import { PrivateRoute, Alert } from "@/components";
import { FirebaseProvider } from "@/components";
import { AppSidebar } from "@/components/ui/app_sidebar/AppSidebar";
import { Dashboard } from "@/pages/dashboard";
import { Account } from "@/pages/account";
import { Admin } from "@/pages/admin";
import { Provider } from "react-redux";
import { store } from "./store";
import { TopNavigation } from "@/components";
import "react-notifications-component/dist/theme.css";
import { Container } from "semantic-ui-react";
import { CustomSwitch } from "@/components";

function App({ trans }) {
  return (
    <Provider store={store}>
      <Router>
        <FirebaseProvider>
          <AppSidebar>
            <Alert />
            <TopNavigation i18n={trans} />
            <Container fluid={true} className="resp__container">
              <CustomSwitch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
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
      </Router>
    </Provider>
  );
}

export { App };
