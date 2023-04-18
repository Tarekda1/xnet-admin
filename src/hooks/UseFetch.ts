import { useCallback, useReducer } from "react";
import { getToken } from "../helpers/utility";
import { accountService } from "services";
import constants from "../config/constants";

// type PlansProperties = {
//   users: any[];
//   loading: boolean;
//   error: string;
//   fetchPlansById: () => Promise<void>;
// };
export interface FetchState<R = any> {
  loading?: boolean | null;
  error?: Error | null | undefined;
  errorCode?: number | null;
  data?: R | null;
}

export const DefaultFetchState: FetchState = {
  loading: null,
  error: null,
  errorCode: null,
  data: null,
};

interface RequestConfig<REQ> {
  data?: REQ;
  headers?: any;
  mode?: any;
  cache?: any;
  url?: string;
  signal?: any;
  body?: any;
  method?: any;
}

export type CallFetchFn<REQ, RES> = (
  config: RequestConfig<REQ>
) => Promise<RES>;

function useFetch<REQ = any, RES = any>(): [
  CallFetchFn<REQ, RES>,
  FetchState<RES>
] {
  const reducer = (
    prevState: FetchState<RES>,
    updatedProperty: FetchState<RES>
  ) => ({
    ...prevState,
    ...updatedProperty,
  });

  const [fetchState, setFetchState] = useReducer(reducer, {
    loading: null,
    error: null,
    errorCode: null,
    data: null,
  });

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

  async function handleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (data.error == "Unauthorized") {
      accountService.logout(() => (window.location.href = "/account/login"));
    } else if (!response.ok) {
      //&& accountService.userValue
      if (
        data &&
        (data.code.includes("auth/id-token-expired") ||
          data.code.includes("auth/argument-error"))
      ) {
        console.log("logging out");
        accountService.logout(() => (window.location.href = "/account/login"));
      } else if ([401, 403].includes(response.status) && getToken() != null) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        accountService.logout(() => (window.location.href = "/account/login"));
      } else if ([401, 403].includes(response.status) && getToken() == null) {
        accountService.logout(() => (window.location.href = "/account/login"));
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  }

  const callFetchFn: CallFetchFn<REQ, RES> = useCallback(async (config) => {
    // state on loading
    setFetchState({
      loading: true,
      error: null,
    });

    //const source = fetch.CancelToken.source();

    try {
      const response = await fetch(config.url, {
        headers: {
          Accept: "application/json",
          ...(config.headers || {}),
          ...authHeader(config.url),
        },
      });

      const data = await handleResponse(response);

      // state on success
      setFetchState({
        loading: false,
        error: null,
        data: data,
      });

      return data;
    } catch (e) {
      // state on error
      setFetchState({
        loading: false,
        error: e || null,
        errorCode: e.response?.status || null,
        data: null,
      });

      // Dont throw if running locally
      if (process.env.NODE_ENV === "development") return e;

      // Compose a verbose error message to pass on to stackdriver
      throw new Error(
        e
          ? `APIError: ${config.headers.method} ${config.url} failed, status: ${
              e.response?.status ?? "unknown"
            }, reqid: ${e.response?.data?.requestId ?? "unknown"}, error msg: ${
              e.response?.data?.errors?.[0]?.message
            }`
          : "unknown"
      );
    }
  }, []);

  return [callFetchFn, fetchState];
}

export default useFetch;
