import types from "@/_actions/types.js";
import { isMobile } from "react-device-detect";

const initialState = {
  language: "en",
  showLoading: false,
  languages: [],
  showSearching: false,
  subscribers: [],
  showMenu: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.FILL_LANGUAGES:
      return { ...state, languages: payload };
    case types.LOADING:
      return { ...state, showLoading: payload };
    case types.SEARCHING:
      return { ...state, showSearching: payload };
    case types.CHANGE_LANGUAGE:
      return { ...state, language: payload };
    case types.LOAD_SUBSCRIBERS:
      return { ...state, subscribers: payload };
    case types.TOGGLE_MENU:
      return { ...state, showMenu: !state.showMenu };
    default:
      return state;
  }
};
