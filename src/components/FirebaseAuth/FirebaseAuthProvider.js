import React, { useState, useCallback, useEffect, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation } from "react-router-dom";
import firebase from "../firebaseutility/firebase";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log(user);
    if (!user) {
      onRedirectCallback("/dashboard");
    }
  }, []);

  const getTokenSilently = useCallback(
    (firebaseAuth) => firebaseAuth.getIdToken(),
    []
  );

  return (
    <FirebaseContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        loginWithRedirect,
        getTokenSilently,
        logout,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider };
