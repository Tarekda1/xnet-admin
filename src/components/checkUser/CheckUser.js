import React, { useEffect, useState, Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountService } from "@/services";
import userActions from "@/actions/userActions";

export const CheckUser = () => {
  const history = useHistory();
  const needCheckUser = useSelector((state) => state.user.needCheckUser);
  const dispatch = useDispatch();
  //const [user, setUser] = useState(null);
  useEffect(() => {
    //post to check user and if not authorized redirect to login
    async function validateUser() {
      try {
        const userResp = await accountService.checkUser();
        console.log(userResp);
        if (!userResp) {
          // accountService.logout(() => {
          //   history.push("/login");
          // });
          dispatch(userActions.performLogout());
        }
      } catch (err) {
        if (err == "Unauthorized") {
          dispatch(userActions.performLogout());
        }
        console.log(`err :${err}`);
      }
    }
    if (needCheckUser) validateUser();
    return () => {};
  }, []);
  return <Fragment></Fragment>;
};
