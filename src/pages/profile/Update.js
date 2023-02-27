import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { accountService, alertService } from "@/services";
import {
  Container,
  Header,
  Segment,
  Grid,
  Table,
  Button,
  Icon,
  Confirm,
} from "semantic-ui-react";
import { Loading, Avatar } from "@/components";
import "./profile.css";
import userActions from "@/actions/userActions";
import "./update.less";

function Update({ history }) {
  //const user = accountService.userValue;
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [opendelete, setOpenDelete] = useState(false);
  const initialValues = {
    title: user.title,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        if (password) return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    console.log(user);
    accountService
      .update(user.id, fields)
      .then((user) => {
        console.log(`user from response ${user}`);
        dispatch(userActions.updateProfile(user));
        alertService.success("Update successful", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
        console.log(error);
        if (error == "Unauthorized") {
          let user = accountService.refreshToken();
          localStorage.setItem("user", JSON.stringify(user));
          history.replace("/");
        }
      });
  }

  const [isDeleting, setIsDeleting] = useState(false);
  function onDelete() {
    setOpenDelete(false);
    setIsDeleting(true);
    accountService
      .delete(user.id)
      .then(() => alertService.success("Account deleted successfully"));
  }

  return (
    <Container fluid>
      <Segment>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Avatar className="profile__avatar" />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Table className="updateProfile">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>
                            <label>Title</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="title"
                              as="select"
                              className={
                                "form-control" +
                                (errors.title && touched.title
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            >
                              <option value="" />
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Ms">Ms</option>
                            </Field>
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <label>First Name</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="firstName"
                              type="text"
                              className={
                                "form-control" +
                                (errors.firstName && touched.firstName
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <label>Last Name</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="lastName"
                              type="text"
                              className={
                                "form-control" +
                                (errors.lastName && touched.lastName
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            />
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <label>Email</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="email"
                              type="text"
                              className={
                                "form-control" +
                                (errors.email && touched.email
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                  <Grid.Column className="passwordcol" width={6}>
                    <Header as="h3" className="passwordcol__header">
                      Change Password
                    </Header>
                    <p>Leave blank to keep the same password</p>
                    <Table className="updateProfile">
                      <Table.Body>
                        <Table.Row className="form-row">
                          <Table.Cell>
                            <label>Password</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="password"
                              type="password"
                              className={
                                "form-control" +
                                (errors.password && touched.password
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <label>Confirm Password</label>
                          </Table.Cell>
                          <Table.Cell>
                            <Field
                              name="confirmPassword"
                              type="password"
                              className={
                                "form-control" +
                                (errors.confirmPassword &&
                                touched.confirmPassword
                                  ? " is-invalid"
                                  : "") +
                                " updateProfile__input"
                              }
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16} textAlign="right">
                    <div className="form-group">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        icon
                        className="updateProfile__action basicStyle"
                      >
                        <Icon name="save" /> Save
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setOpenDelete(true)}
                        className="updateProfile__action updateProfile__action-delete basicStyle"
                        icon
                        loading={isDeleting}
                        disabled={isDeleting}
                      >
                        <Icon name="trash" /> Delete
                      </Button>
                      <Confirm
                        open={opendelete}
                        onCancel={() => setOpenDelete(false)}
                        onConfirm={onDelete}
                      />
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          )}
        </Formik>
      </Segment>
    </Container>
  );
}

export { Update };
