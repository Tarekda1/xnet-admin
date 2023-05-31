import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  Dropdown,
} from "semantic-ui-react";
import useFetch from "hooks/UseFetch";
import { billingService, alertService } from "services";
import constants from "config/constants";
import { Loading } from "components/";
import "./add-edit.scss";
import { useSelector } from "react-redux";

function AddEdit({ open, Id, onSave, onClose }) {
  const initialState = {
    userId: "",
    dueDate: "",
    issueDate: Date.now(),
    amount: 0,
    collector: "",
    planId: "",
  };

  const isVisible = useRef(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(initialState);
  const subscribersState = useSelector(
    (state: any) => state?.global.filteredSubscribers
  );

  const subscribers = useMemo(() => {
    console.log(subscribersState);
    return subscribersState.reduce((acc, subs) => {
      console.log(subs);
      acc.push({
        key: subs.subscriberId,
        value: subs.subscriberId,
        text: subs.Username,
      });
      return acc;
    }, []);
  }, [subscribersState]);

  const [addInvoice] = useFetch<{}, Response>();

  const isAddMode = (id) => id === "";

  useEffect(() => {
    //setId(Id);
    if (Id === "") {
      setInvoice(initialState);
    }
    return () => {};
  }, [open]);

  useEffect(() => {
    console.log(JSON.stringify(invoice));
    return () => {};
  }, [invoice]);

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("susbcribername is required"),
    dueDate: Yup.number().required("DueDate is required"),
    issueDate: Yup.string().required("IssueDate is required"),
    amount: Yup.string().required("Amount is required"),
    collector: Yup.string().required("collector is required"),
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
    const resp = await addInvoice({
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
      setInvoice(plan);
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
                      <label>User Id</label>
                      <Dropdown
                        placeholder="user"
                        className="ui selection fluid dropdown"
                        value={invoice.userId}
                        options={subscribers}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("userId", data.value);
                          setInvoice({
                            ...invoice,
                            userId: data.value.toString(),
                          });
                        }}
                      />
                      <ErrorMessage
                        name="firstName"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Due Date</label>
                      <Input
                        placeholder="speed"
                        value={invoice.dueDate}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("dueDate", data.value);
                          setInvoice({
                            ...invoice,
                            dueDate: data.dueDate,
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
                      <label>Bill Amount</label>
                      <Input
                        placeholder="Bill Amount"
                        value={invoice.amount}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("amount", data.amount);
                          setInvoice({
                            ...invoice,
                            amount: Number(data.value),
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
                      <label>Plan</label>
                      <Input
                        placeholder="description"
                        value={invoice.planId}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("description", data.value);
                          setInvoice({
                            ...invoice,
                            planId: data.planId,
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
                    <div className="form-group__col">
                      <label>Collector</label>
                      <Input
                        placeholder="description"
                        value={invoice.planId}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("collector", data.userId);
                          setInvoice({
                            ...invoice,
                            collector: data.userId,
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
                    setInvoice(initialState);
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
