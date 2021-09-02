import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.less";
import { PrivateRoute, Alert } from "@/_components";
import { AppSidebar } from "@/_components/ui/app_sidebar/AppSidebar";
import { Dashboard } from "@/_containers/dashboard";
import { Account } from "@/_containers/account";
import { Admin } from "@/_containers/admin";
import { Provider } from "react-redux";
import { store } from "./store";
import { TopNavigation } from "@/_components";
import "react-notifications-component/dist/theme.css";
import { Container } from "semantic-ui-react";
import { CustomSwitch } from "@/_components";

function App({ trans }) {
  return (
    <Provider store={store}>
      <Router>
        <AppSidebar>
          <Alert />
          <TopNavigation i18n={trans} />
          <Container fluid={true}>
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
          <div
            style={{
              position: "absolute",
              bottom: 0,
              display: "flex",
              background: "darkgray",
              width: "100%",
              padding: "5px 0",
              flex: 1,
              justifyContent: "center",
            }}
          >
            حقوق النشر محفوظة Xnet {new Date().getFullYear()}
          </div>
        </AppSidebar>
      </Router>
    </Provider>
  );
}

export { App };
