import types from "./types";

export default {
  /**
   * @param token user token info
   * @param info user general info
   */
  successfulLogin: (data) => {
    return {
      type: types.SUCCESSFUL_LOGIN,
      payload: { loginDate: new Date(), ...data },
    };
  },

  performLogout: () => {
    return {
      type: types.PERFORM_LOGOUT,
    };
  },

  updateProfile: (data) => {
    return {
      type: types.UPDATE_PROFILE,
      payload: data,
    };
  },
};
