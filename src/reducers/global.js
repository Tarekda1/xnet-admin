import types from "@/_actions/types";

const initialState = {
  language: "en",
  showLoading: false,
  languages: [],
  showSearching: false,
  subscribers: [],
  appliedFilters: [],
  status: "all",
  showMenu: false,
  loaded: false
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
      return { ...state, subscribers: payload, filteredSubscribers: payload.slice(0), loaded: true };
    case types.ADD_SUBSCRIBER:
      return { ...state, subscribers: [...state.subscribers, payload] };
    case types.CHANGE_FILTER_STATUS:
      return { ...state, status: payload };
    case types.UPDATE_SUBSCRIBER:
      console.log(payload);
      let myState = Object.assign({}, state);
      let index = myState.filteredSubscribers.findIndex(s => s.username == payload.username);
      console.log(index);
      myState.filteredSubscribers[index] = payload;
      if (status == "not_paid") {
        filteredValues = filteredValues.filter(s => s.subscribtionpaid == false);
        newState.filteredSubscribers = filteredValues;
      }
      return myState;
    case types.FILTER_SUBSCRIBERS:
      console.log("hello");
      let newState = Object.assign({}, state);
      //the value received from our presentational component
      let { text, status } = payload;
      console.log(text);
      console.log(status);
      let filteredValues = newState.subscribers;
      if (text != "") {
        filteredValues = filteredValues.filter(subscriber => {
          //look for objects with the received value in their ‘name’ or ‘designer’ fields
          return subscriber.subscribername.toLowerCase().includes(text);
          //||product.designer.toLowerCase().includes(value);
        });
      }

      if (status !== "all") {
        let paid = status == "paid";
        filteredValues = filteredValues.filter(s => s.subscribtionpaid == paid);
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
