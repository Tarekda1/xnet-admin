import { accountService } from "../services";
import { getToken } from "./utility";
import constants from "../config/constants";

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
  postForm,
  putForm,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body, useJson = true) {
  console.log("usejson", useJson);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/form-data",
      ...authHeader(url),
    },
    credentials: "include",
    body: useJson ? JSON.stringify(body) : body,
  };
  console.log(authHeader(url));
  return fetch(url, requestOptions).then(handleResponse);
}

function postForm(url, body, useJson = true) {
  console.log("usejson", useJson);
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(url) },
    credentials: "include",
    body: body,
  };
  console.log(authHeader(url));
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function putForm(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(url) },
    body,
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = getToken();
  //const isLoggedIn = user && user.jwtToken;
  const isApiUrl = url.startsWith(constants.API_URL);
  if (token && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    // console.log("resp", data);
    // console.log("ok", response.ok);
    if (data.error == "Unauthorized") {
      accountService.logout(() => history.replace("/account/login"));
    } else if (!response.ok) {
      //&& accountService.userValue
      if (
        data &&
        (data.code.includes("auth/id-token-expired") ||
          data.code.includes("auth/argument-error"))
      ) {
        console.log("logging out");
        accountService.logout(() => (window.location = "/account/login"));
      } else if ([401, 403].includes(response.status) && getToken() != null) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        accountService.logout(() => (window.location = "/account/login"));
      } else if ([401, 403].includes(response.status) && getToken() == null) {
        accountService.logout(() => (window.location = "/account/login"));
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
