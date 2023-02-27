import types from "@/actions/types.js";

const initialState = {
  token: "",
  userInfo: {},
  needCheckUser: true,
  loginDate: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SUCCESSFUL_LOGIN:
      console.log(payload);
      const { token, ...userInfo } = payload;
      console.log(userInfo);
      const { displayName, role, email, uid, imageUrl, username } =
        userInfo.info;
      sessionStorage.setItem("token", token);
      return {
        ...state,
        token: token,
        userInfo: {
          uid,
          displayName,
          role,
          email,
          imageUrl,
          username,
        },
      };
    case types.PERFORM_LOGOUT:
      sessionStorage.removeItem("token");
      return {
        token: "",
        userInfo: {},
        needCheckUser: false,
      };
    case types.UPDATE_PROFILE:
      return { ...state, userInfo: payload };
    default:
      return state;
  }
};
