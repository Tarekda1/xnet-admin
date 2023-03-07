import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebaseutility/firebase";

const PrivateRoute = ({ comp: Component, ...rest }) => {
  const [user] = useAuthState(firebase.auth());
  return (
    <Route
      {...rest}
      render={(props) =>
        user != null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/account/login" />
        )
      }
    />
  );
};

export { PrivateRoute };
