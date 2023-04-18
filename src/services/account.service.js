import { BehaviorSubject } from "rxjs";
import { fetchWrapper, history } from "../helpers";
import firebase from "../components/firebaseutility/firebase";
import constants from "../config/constants";
const userSubject = new BehaviorSubject(null);
const baseUrl = `${constants.API_URL}/users`;

export const accountService = {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  user: userSubject.asObservable(),
  checkUser,
  get userValue() {
    return userSubject.value;
  },
};

async function login(email, password) {
  const { user: resp } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  console.log(`resp from firebase: ${resp}`);
  const user = await fetchWrapper.post(`${baseUrl}/login`, { email, password });
  return user;
}

function logout(callback) {
  // if (getToken() !== undefined) clearToken();
  // callback && callback();
  firebase
    .auth()
    .signOut()
    .then(() => {
      callback && callback();
    })
    .catch((error) => {
      console.error("Error signing out", error);
    });
}

function refreshToken() {
  return fetchWrapper.post(`${baseUrl}/refresh-token`, {}).then((user) => {
    // publish user to subscribers and start timer to refresh token
    //userSubject.next(user);
    //startRefreshTokenTimer();
    //localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
}

function register(params) {
  return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
  return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
  return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
  return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({ token, password, confirmPassword }) {
  return fetchWrapper.post(`${baseUrl}/reset-password`, {
    token,
    password,
    confirmPassword,
  });
}

function getAll() {
  return fetchWrapper.get(`${baseUrl}/all`).then(
    (users) => {
      return users;
    },
    (err) => {
      throw err;
    }
  );
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
  return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
  console.log(id);
  return fetchWrapper.put(`${baseUrl}/${id}`, params).then((user) => {
    // update stored user if the logged in user updated their own record
    console.log(`user1: ${JSON.stringify(user)}`);
    return user.user;
  });
}

function checkUser() {
  return fetchWrapper.post(`${baseUrl}/checkUser`);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`).then((x) => {
    // auto logout if the logged in user deleted their own record
    // if (id === user.id) {
    //   logout();
    // }
    return x;
  });
}

// helper functions

// let refreshTokenTimeout;

// function startRefreshTokenTimer() {
// 	// parse json object from base64 encoded jwt token
// 	const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

// 	// set a timeout to refresh the token a minute before it expires
// 	const expires = new Date(jwtToken.exp * 1000);
// 	const timeout = expires.getTime() - Date.now() - 60 * 1000;
// 	refreshTokenTimeout = setTimeout(refreshToken, timeout);
// }

// function stopRefreshTokenTimer() {
// 	clearTimeout(refreshTokenTimeout);
// }
