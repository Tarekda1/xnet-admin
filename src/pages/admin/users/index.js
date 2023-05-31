import React from "react";
import { Route, Routes } from "react-router-dom";

import List from "./List";
import AddEdit from "./AddEdit";

function Users({ match }) {
  const { path } = match;

  return (
    <Routes>
      <Route exact path={path} element={List} />
      <Route path={`${path}/add`} element={AddEdit} />
      <Route path={`${path}/edit/:id`} element={AddEdit} />
    </Routes>
  );
}

export default Users;
