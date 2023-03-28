import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import _, { get } from "lodash";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Grid,
  Input,
  Segment,
  Dropdown,
  Icon,
  Header,
} from "semantic-ui-react";
import { accountService, alertService } from "../../../services";
import { Loading } from "../../../components";
import "./add-edit.scss";

function AddEdit({ history, match, open, Id, onSave, onClose }) {
  //const [ isAddMode, setIsAddMode ] = useState(true);
  const isVisible = useRef(false);
  //const [ id, setId ] = useState(-1);
  const [loading, setLoading] = useState(false);
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };
  const [user, setUser] = useState(initialState);
  //const [errors, setErrors] = useState({});
  //const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: "",
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const isAddMode = (id) => id === -1;

  useEffect(() => {
    //setId(Id);
    if (Id === -1) {
      setUser(initialValues);
    }
    return () => {};
  }, [open]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("First Name is required"),
    username: Yup.string().required("First Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .concat(Id === -1 ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        if (password) return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (Id === -1) {
      createUser(fields, setSubmitting);
    } else {
      updateUser(Id, fields, setSubmitting);
    }
  }

  function createUser(fields, setSubmitting) {
    accountService
      .create(fields)
      .then(() => {
        alertService.success("User added successfully", {
          keepAfterRouteChange: true,
        });
        onSave();
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateUser(id, fields, setSubmitting) {
    accountService
      .update(id, fields)
      .then(() => {
        onSave();
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  const roles = ["Admin", "Collector"];
  const rolesOptions = _.map(roles, (value, index) => ({
    key: roles[index],
    text: value,
    value: roles[index],
  }));

  return (
    <Modal open={open}>
      <Header as="h2">{isAddMode(Id) ? "Add User" : "Edit User"}</Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => {
          useEffect(() => {
            console.log(`id ${Id}`);
            // if (id !== Id) {
            if (Id !== -1 && open) {
              async function fetchUser() {
                try {
                  setLoading(true);
                  const { user } = await accountService.getById(Id).then();
                  setUser(user);
                  const fields = ["name", "username", "email", "role"];
                  fields.forEach((field) => {
                    setFieldValue(field, user[field], false);
                  });
                  setLoading(false);
                } catch (error) {
                  console.log(error);
                  setLoading(false);
                }
              }
              fetchUser();
            }
            return () => {
              isVisible.current = false;
            };
            //}
          }, [open]);

          return (
            <Form style={{ padding: "15px" }}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Name</label>
                      <Input
                        name="Name"
                        placeholder="Name"
                        value={user.name}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("name", data.value);
                          setUser({
                            ...user,
                            name: data.value,
                          });
                        }}
                        className={
                          "form-control" + (errors.name ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="firstName"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Username</label>
                      <Input
                        placeholder="Username"
                        value={user.username}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("username", data.value);
                          setUser({
                            ...user,
                            username: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.username ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="lastName"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>email</label>
                      <Input
                        placeholder="email"
                        value={user.email}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("email", data.value);
                          setUser({
                            ...user,
                            email: data.value,
                          });
                        }}
                        className={
                          "form-control" + (errors.email ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage name="email" className="invalid-feedback" />
                    </div>
                    <div className="form-group__col">
                      <label>Role</label>
                      <Dropdown
                        placeholder="Role"
                        className="ui selection fluid dropdown"
                        value={user.role}
                        options={rolesOptions}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("role", data.value);
                          setUser({
                            ...user,
                            role: data.value,
                          });
                        }}
                      />
                      <ErrorMessage name="role" className="invalid-feedback" />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="form-row" />
                    {!Id === -1 && (
                      <div>
                        <p>Leave blank to keep the same password</p>
                      </div>
                    )}
                    <div className="form-row">
                      <div className="form-group__col">
                        <label>Password</label>
                        <Input
                          type="password"
                          onChange={(e, data) => {
                            console.log(data);
                            setFieldValue("password", data.value);
                            setUser({
                              ...user,
                              password: data.value,
                            });
                          }}
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="password"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group__col">
                        <label>Confirm Password</label>
                        <Input
                          type="password"
                          onChange={(e, data) => {
                            console.log(data);
                            setFieldValue("confirmPassword", data.value);
                            setUser({
                              ...user,
                              confirmPassword: data.value,
                            });
                          }}
                          className={
                            "form-control" +
                            (errors.confirmPassword && touched.confirmPassword
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Segment floated="right" className="form-group model-actions">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="btn basicStyle"
                  icon
                >
                  {Id === -1 ? (
                    <React.Fragment>
                      <Icon name="plus" />
                      Add
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Icon name="save" /> Save
                    </React.Fragment>
                  )}
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setUser(initialValues);
                    onClose();
                  }}
                  className="btn basicStyle"
                >
                  Cancel
                </Button>
              </Segment>
              {loading ? <Loading /> : ""}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default AddEdit;
