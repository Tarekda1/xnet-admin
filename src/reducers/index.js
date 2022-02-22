import { combineReducers } from "redux";
import user from "./user";
import global from "./global";
import expense from "./expense";

const appReducer = combineReducers({
  user,
  global,
  expense
});

export default (state, action) => {
  if (action.type === "PERFORM_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};
