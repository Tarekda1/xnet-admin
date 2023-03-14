import types from "./types";
import { ispService } from "../services";
import userActions from "../actions/userActions";
import { showNotification } from "../helpers";
import Pagged from "../helpers/pagged-class";
import { customerService, alertService } from "../services";

const globalActions = {
  changeLanguage: (data) => {
    return {
      type: types.CHANGE_LANGUAGE,
      payload: data,
    };
  },
  fillLanguages: (data) => {
    return {
      type: types.FILL_LANGUAGES,
      payload: data,
    };
  },
  shouldLoad: (data) => {
    return {
      type: types.LOADING,
      payload: data,
    };
  },
  showSearch: (data) => {
    return {
      type: types.SEARCHING,
      payload: data,
    };
  },
  toggleMenu: (data) => {
    return {
      type: types.TOGGLE_MENU,
      payload: data,
    };
  },
  loadSusbcribers: (data) => {
    console.log(data);
    return {
      type: types.LOAD_SUBSCRIBERS,
      payload: data,
    };
  },
  updateSubscriber: (subscriberId, paidStatus) => {
    return async (dispatch, getState) => {
      //setSubscribers((prevSubs) => {
      const subscribers = getState().global.subscribers.slice(0);
      let selected = subscribers.find(
        (subs) => subs.subscriberId == subscriberId
      );
      selected.subscribtionpaid = paidStatus;
      dispatch({
        type: types.UPDATE_SUBSCRIBER,
        payload: selected,
      });
      //dispatch(globalActions.shouldLoad(false));
      //});
    };
  },
  fetchSubscribers: (params) => {
    return async (dispatch, getState) => {
      try {
        console.log(params);
        dispatch(globalActions.shouldLoad(true));
        const data = await customerService.getAllCustomers(params);
        console.log(data);
        dispatch(globalActions.loadSusbcribers(data));
        dispatch(globalActions.shouldLoad(false));
      } catch (err) {
        if (err === 403) {
          dispatch(userActions.logout());
        }
      }
    };
  },
  filterSusbcribers: (filter) => {
    console.log("filter");
    return {
      type: types.FILTER_SUBSCRIBERS,
      payload: filter,
    };
  },
  filterPaidStatus: (status) => {
    console.log("filter");
    return {
      type: types.FILTER_PAID,
      payload: status,
    };
  },
  addSusbcriber: (param) => {
    return async (dispatch, getState) => {
      try {
        console.log(param);
        dispatch(globalActions.shouldLoad(true));
        const newSubscriber = await customerService.create(param);
        alertService.success("Subscriber added successfully", {
          keepAfterRouteChange: true,
        });
        console.log(newSubscriber);
        dispatch({
          type: types.ADD_SUBSCRIBER,
          payload: newSubscriber,
        });
        dispatch(globalActions.shouldLoad(false));
      } catch (err) {
        console.log(err);
        alertService.error(err);
        if (err === 403) {
          dispatch(userActions.logout());
        }
      }
    };
  },
};

export { globalActions };
