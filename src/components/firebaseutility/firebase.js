import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZHw_AyGMKVbMUMvSECHitRBroQTksxoA",
  authDomain: "xnet-68e82.firebaseapp.com",
  databaseURL: "https://xnet-68e82.firebaseio.com",
  projectId: "xnet-68e82",
  storageBucket: "xnet-68e82.appspot.com",
  messagingSenderId: "59739508964",
  appId: "1:59739508964:web:c8092ea4de529c1fe75cf1",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
