import { combineReducers } from "redux";
import user from "./user";
import global from "./global";

const appReducer = combineReducers({
  user,
  global,
});

export default (state, action) => {
  if (action.type === "PERFORM_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};
