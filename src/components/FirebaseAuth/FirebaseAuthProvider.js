import React, { useState, useCallback, useEffect, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation } from "react-router-dom";
import firebase from "../firebaseutility/firebase";
// const initialContext = {
//   isAuthenticated: false,
//   user: null,
//   loading: false,
//   isInitialized: false,
//   handleRedirectCallback: () => {},
//   getIdTokenClaims: () => {},
//   loginWithRedirect: () => {},
//   logout: () => {},
// };

const FirebaseContext = React.createContext();

export const useFirebaseAuth = () => useContext(FirebaseContext);

const FirebaseProvider = ({ children, onRedirectCallback }) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  useEffect(() => {
    getCurrentUser(firebase.auth()).then(
      (user) => {
        console.log(`user inside provider: ${user}`);
        if (!user || user == null) {
          onRedirectCallback({ targetUrl: "/account/login" });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const getTokenSilently = useCallback(
    (firebaseAuth) => firebaseAuth.getIdToken(),
    []
  );

  const logout = useCallback(
    () =>
      firebase
        .auth()
        .signOut()
        .catch((error) => {
          console.error("Error signing out", error);
        }),
    []
  );

  return (
    <FirebaseContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        getTokenSilently,
        logout,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
export default FirebaseProvider;
