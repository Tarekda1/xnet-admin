import types from "../actions/types";

interface global {
  language?: string;
  showLoading?: Boolean;
  languages?: [];
  showSearching?: Boolean;
  subscribers?: [];
  appliedFilters?: [];
  filteredSubscribers?: [Subsriber];
  status?: string;
  showMenu?: Boolean;
  loaded: Boolean;
}

interface Subsriber {
  subscribername?: string;
  username?: string;
}

const initialState: global = {
  language: "en",
  showLoading: false,
  languages: [],
  showSearching: false,
  subscribers: [],
  appliedFilters: [],
  status: "all",
  showMenu: true,
  loaded: false,
};

function addFilterIfNotExists(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  if (index === -1) appliedFilters.push(filter);

  return appliedFilters;
}

function removeFilter(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  appliedFilters.splice(index, 1);
  return appliedFilters;
}

export default (state: global = initialState, action) => {
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
      return {
        ...state,
        subscribers: payload,
        filteredSubscribers: payload.slice(0),
        loaded: true,
      };
    case types.ADD_SUBSCRIBER:
      console.log("add:" + JSON.stringify(payload));
      return { ...state, subscribers: [...state.subscribers, payload] };
    case types.CHANGE_FILTER_STATUS:
      return { ...state, status: payload };
    case types.UPDATE_SUBSCRIBER:
      console.log(payload);
      let myState: global = Object.assign({}, state);
      let index = myState.filteredSubscribers.findIndex(
        (s) => s.username == payload.username
      );
      console.log(index);
      myState.filteredSubscribers[index] = payload;

      return myState;
    case types.FILTER_SUBSCRIBERS:
      console.log("hello");
      let newState = Object.assign({}, state);
      //the value received from our presentational component
      let { text, status } = payload;
      let filteredValues: any = newState.subscribers;
      if (text != "") {
        filteredValues = filteredValues.filter((subscriber) => {
          //look for objects with the received value in their ‘name’ or ‘designer’ fields
          if (subscriber && subscriber.subscribername)
            return subscriber.subscribername.toLowerCase().includes(text);
          //||product.designer.toLowerCase().includes(value);
        });
      }

      if (status !== "all") {
        let paid = status == "paid";
        filteredValues = filteredValues.filter(
          (s) => s.subscribtionpaid == paid
        );
      }
      //set filtered subscribers to new values
      newState.filteredSubscribers = filteredValues;
      return newState;
    //return { ...state, subscribers: [...state.subscribers] };
    case types.TOGGLE_MENU:
      return { ...state, showMenu: !state.showMenu };
    default:
      return state;
  }
};
