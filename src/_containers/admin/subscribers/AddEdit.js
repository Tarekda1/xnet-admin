import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import _, { get } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Grid,
  Input,
  Segment,
  Dropdown,
  Icon,
  Message,
  Header,
  Checkbox,
} from "semantic-ui-react";
import { customerService, alertService } from "@/_services";
import { Loading } from "@/_components/";
import "./add-edit.less";
import { globalActions } from "../../../_actions/globalActions";

function AddEdit({ history, match, open, Id, onSave, onClose }) {
  const isVisible = useRef(false);
  const [loading, setLoading] = useState(false);
  const [subscriber, setSubscriber] = useState(initialState);
  const dispatch = useDispatch();

  const initialState = {
    subscribername: "",
    subscribtionfees: 150000,
    username: "",
    collectorname: "",
    susbcriberId: "",
    billDate: "",
    paymentDate: "",
    subscribtionpaid: false,
  };

  const isAddMode = (id) => id === -1;

  useEffect(() => {
    //setId(Id);
    if (Id === -1) {
      setSubscriber(initialState);
    }
    return () => {};
  }, [open]);

  const validationSchema = Yup.object().shape({
    subscribername: Yup.string().required("susbcribername is required"),
    username: Yup.string().required("username is required"),
    subscribtionfees: Yup.number().required("fees is required"),
    billDate: Yup.date().default(new Date()),
    paymentDate: Yup.date().default(new Date()),
    subscribtionpaid: Yup.boolean().required().oneOf([true, false]),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (Id === -1) {
      createSusbcriber(fields, setSubmitting);
    } else {
      updateSubscriber(Id, fields, setSubmitting);
    }
  }

  function createSusbcriber(fields, setSubmitting) {
    // customerService
    //   .create(fields)
    //   .then(() => {
    //     alertService.success("Subscriber added successfully", {
    //       keepAfterRouteChange: true,
    //     });
    //     onSave();
    //   })
    //   .catch((error) => {
    //     setSubmitting(false);
    //     alertService.error(error);
    //   });
    console.log("dispatched");
    dispatch(globalActions.addSusbcriber(fields));
    onSave();
  }

  function updateSubscriber(id, fields, setSubmitting) {
    customerService
      .update(id, fields)
      .then(() => {
        onSave();
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <Modal open={open}>
      <Header as="h2">
        {isAddMode(Id) ? "Add Subscriber" : "Edit Subscriber"}
      </Header>
      <Formik
        initialValues={initialState}
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
                  const { user: subscriber } = await customerService.getById(
                    Id
                  );
                  setSubscriber(subscriber);
                  const fields = [
                    "susbcribername",
                    "username",
                    "subscribtionfees",
                    "subscribtionpaid",
                    "billDate",
                    "subscriberId",
                    "paymentDate",
                    "collectorname",
                  ];
                  fields.forEach((field) => {
                    setFieldValue(field, subscriber[field], false);
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
          {
            console.log(errors);
          }
          return (
            <Form style={{ padding: "15px" }}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Subscriber Name</label>
                      <Input
                        name="subscribername"
                        placeholder="Subscriber Name"
                        value={subscriber.subscribername}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("subscribername", data.value);
                          setSubscriber({
                            ...subscriber,
                            subscribername: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.subscribername ? " is-invalid" : "")
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
                        value={subscriber.username}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("username", data.value);
                          setSubscriber({
                            ...subscriber,
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
                      <label>Subscribtion Fees</label>
                      <Input
                        placeholder="subscribtionfees"
                        value={subscriber.subscribtionfees}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("subscribtionfees", data.value);
                          setSubscriber({
                            ...subscriber,
                            subscribtionfees: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.subscribtionfees ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="subscribtionfees"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Payment Date</label>
                      <Input
                        placeholder="Payment Date"
                        value={subscriber.paymentDate}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("paymentDate", new Date(data.value));
                          setSubscriber({
                            ...subscriber,
                            paymentDate: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.paymentDate ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="paymentDate"
                        className="invalid-feedback"
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Bill Due Date</label>
                      <Input
                        placeholder="Bill Due Date"
                        value={subscriber.billDate}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("billDate", new Date(data.value));
                          setSubscriber({
                            ...subscriber,
                            billDate: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.billDate ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="billDate"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Susbcribtion Paid</label>
                      <Checkbox
                        checked={subscriber.subscribtionpaid}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("subscribtionpaid", data.checked);
                          setSubscriber({
                            ...subscriber,
                            subscribtionpaid: data.checked,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.subscribtionpaid ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="subscribtionpaid"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Collector Name</label>
                      <Input
                        placeholder="Collector Name"
                        value={subscriber.collectorname}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("collectorname", data.value);
                          setSubscriber({
                            ...subscriber,
                            collectorname: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.collectorname ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="collectorname"
                        className="invalid-feedback"
                      />
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
                    setSubscriber(initialState);
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

export { AddEdit };
