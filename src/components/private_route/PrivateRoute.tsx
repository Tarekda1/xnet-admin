import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebaseutility/firebase";

type Props = {
  Component?: React.FC;
  render?: (props: any) => any;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<Props> = ({
  Component,
  path,
  exact,
  render,
  ...rest
}) => {
  const [user] = useAuthState(firebase.auth());

  if (user == null) {
    return (
      <Route {...rest} render={(props) => <Redirect to="/account/login" />} />
    );
  }

  const componentRender = (props: any) =>
    Component ? <Component {...props} /> : null;

  return (
    <Route
      exact={exact}
      path={path}
      render={render || componentRender}
      {...rest}
    />
  );
};

export { PrivateRoute };
