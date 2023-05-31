import React from "react";
import { Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebaseutility/firebase";
import { Login } from "../../routes/pages";

type Props = {
  Component?: React.FC;
  render: React.ReactNode;
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
    return <Route {...rest} element={Login} />;
  }

  const componentRender = Component ? <Component /> : render;

  return <Route {...rest} path={path} element={componentRender} />;
};

export { PrivateRoute };
