import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import _ from "lodash";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Grid,
  Input,
  Segment,
  Icon,
  Header,
} from "semantic-ui-react";
import useFetch from "hooks/UseFetch";
import { billingService, alertService } from "services";
import constants from "config/constants";
import { Loading } from "components/";
import "./add-edit.scss";

function AddEdit({ open, Id, onSave, onClose }) {
  const initialState = {
    name: "",
    price: 150000,
    speed: "",
    description: "",
    planId: "",
  };

  const isVisible = useRef(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(initialState);

  const [addPlan, addPlanState] = useFetch<{}, Response>();

  const isAddMode = (id) => id === "";

  useEffect(() => {
    //setId(Id);
    if (Id === "") {
      setPlan(initialState);
    }
    return () => {};
  }, [open]);

  useEffect(() => {
    console.log(JSON.stringify(plan));
    return () => {};
  }, [plan]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("susbcribername is required"),
    price: Yup.number().required("username is required"),
    speed: Yup.string().required("fees is required"),
    description: Yup.string().required("username is required"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (Id === "") {
      createPlan(fields, setSubmitting);
    } else {
      updatePlan(Id, fields, setSubmitting);
    }
  }

  async function createPlan(fields, setSubmitting) {
    console.log("dispatched");
    console.log(fields);
    const resp = await addPlan({
      headers: {},
      method: "POST",
      url: `${constants.API_URL}/billing/plans`,
      body: JSON.stringify(fields),
    });
    console.log(resp);
    onSave();
  }

  function updatePlan(id, fields, setSubmitting) {
    billingService
      .updatePlan(id, fields)
      .then(() => {
        onSave();
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  async function fetchUser(setFieldValue) {
    try {
      setLoading(true);
      const plan = await billingService.getPlanById(Id);
      setPlan(plan);
      const fields = ["name", "speed", "price", "description"];
      fields.forEach((field) => {
        setFieldValue(field, plan[field], false);
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Modal open={open}>
      <Header as="h2">{isAddMode(Id) ? "Add Plan" : "Edit Plan"}</Header>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => {
          useEffect(() => {
            console.log(`id ${Id}`);
            // if (id !== Id) {
            if (Id !== "" && open) {
              fetchUser(setFieldValue);
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
                      <label>Plan Name</label>
                      <Input
                        name="name"
                        placeholder="Plan Name"
                        value={plan.name}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("name", data.value);
                          setPlan({
                            ...plan,
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
                      <label>Speed</label>
                      <Input
                        placeholder="speed"
                        value={plan.speed}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("speed", data.value);
                          setPlan({
                            ...plan,
                            speed: data.value,
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
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Price</label>
                      <Input
                        placeholder="Bill Due Date"
                        value={plan.price}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("price", data.value);
                          setPlan({
                            ...plan,
                            price: Number(data.value),
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
                      <label>Description</label>
                      <Input
                        placeholder="description"
                        value={plan.description}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("description", data.value);
                          setPlan({
                            ...plan,
                            description: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.username ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="description"
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
                  {Id === "" ? (
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
                    setPlan(initialState);
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
