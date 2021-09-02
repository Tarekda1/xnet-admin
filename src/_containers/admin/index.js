import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Subscribers from "./subscribers";
import { Users } from "./users";
import { ImportUsers } from "./subscribers/ImportUsers";

function Admin({ match }) {
  let { path, url } = useRouteMatch();
  console.log(path);

  return (
    <div className="p-4">
      <div className="container">
        <Switch>
          <Route exact path={`${path}/`} component={Subscribers} />
          <Route path={`${path}/users`} component={Users} />
          <Route path={`${path}/importusers`} component={ImportUsers} />
        </Switch>
      </div>
    </div>
  );
}

export { Admin };
