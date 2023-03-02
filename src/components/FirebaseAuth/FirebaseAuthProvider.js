import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import firebase from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const initialContext = {
  isAuthenticated: false,
  user: null,
  loading: false,
  isInitialized: false,
  handleRedirectCallback: () => {},
  getIdTokenClaims: () => {},
  loginWithRedirect: () => {},
  logout: () => {},
};

const FirebaseContext = React.createContext(initialContext);

export const useFirebaseAuth = () => useContext(FirebaseContext);

const FirebaseProvider = ({ children, onRedirectCallback }) => {
  const [user, loading, error] = useAuthState(firebase.auth());
};
