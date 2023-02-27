import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = sessionStorage.getItem("token");
  //const token = useSelector((state) => state.user.token);
  return (
    <Route
      {...rest}
      render={(props) =>
        token != null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/account/login" />
        )
      }
    />
  );
};

export { PrivateRoute };
