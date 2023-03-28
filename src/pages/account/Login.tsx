import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Header,
  Message,
  Segment,
  Image,
  Form,
  Button,
} from "semantic-ui-react";
import * as Yup from "yup";
import userActions from "../../actions/userActions";
import { useTranslation } from "react-i18next";
import { accountService, alertService } from "../../services";
import firebase from "../../components/firebaseutility/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import routes from "routes/routes";
import logo from "images/xnet_logo_main.png";
import { Role } from "../../helpers/Role";

function Login({ history, location }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(firebase.auth());
  const token = useSelector((state: any) => state.user.token);
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(false);
  const isVisible = useRef(true);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    // token && sessionStorage.getItem("token")
    console.log(`user inside login: ${user}`);
    if (user !== null && userInfo.role !== undefined) {
      console.log("role", userInfo.role);
      console.log("role constant", Role.Admin);
      if (userInfo.role == Role.Admin) {
        console.log("/admin");
        history.push({ pathname: routes.index });
      } else {
        const { from } = location.state || { from: { pathname: "/" } };
        history.push(from);
      }
    } else {
      dispatch(userActions.performLogout());
    }
  }, [token, dispatch]);

  function onSubmit() {
    let formObj = { username, password };
    validationSchema
      .validate(formObj)
      .then(function (value) {
        setProgress(true);
        alertService.clear();
        accountService
          .login(username, password)
          .then((response) => {
            console.log(response);
            if (response.token) {
              const { token, ...userInfo } = response;
              console.log(token);
              dispatch(
                userActions.successfulLogin({
                  token,
                  info: userInfo,
                })
              );
              setProgress(false);
            }
          })
          .catch((error) => {
            setProgress(false);
            alertService.error(error);
          });
      })
      .catch(function (err) {
        alertService.error(err);
        console.log(err);
      });
  }

  const handleReset = () => {};
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <div className="card m-3">
            <Grid
              textAlign="center"
              style={{ height: "100vh" }}
              verticalAlign="middle"
            >
              <Grid.Column style={{ maxWidth: 450 }}>
                <Image size="medium" centered src={logo} />
                <Header as="h4" style={{ margin: "5px" }} textAlign="center">
                  <p>Xnet - خدمات انترنت</p>
                </Header>
                <Segment stacked>
                  <div className="card-body" />
                  <Form autoComplete="off">
                    <Form.Input
                      fluid
                      icon="user"
                      iconPosition="left"
                      placeholder="الايميل"
                      name="username"
                      autoComplete="off"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
                      placeholder="كلمة السر"
                      autoComplete="off"
                      type="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      className={"primary-button"}
                      loading={progress}
                      fluid
                      type="submit"
                      size="large"
                      onClick={() => onSubmit()}
                    >
                      دخول
                    </Button>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
