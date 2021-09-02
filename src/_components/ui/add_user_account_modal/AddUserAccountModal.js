import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Segment,
  Form,
  Modal,
  Button,
  Header,
  Checkbox,
  Grid,
  Dropdown,
  Icon,
  Label,
  Message,
} from "semantic-ui-react";
import { ispService } from "@/_services/";
import { formatDate } from "@/_helpers/utility";

const AddUserAccountModel = ({ open, onSubmit, onClose, edit, userAcc }) => {
  //onst [showModel, setshowModel] = useState(true);
  const mountedRef = useRef(true);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    paid: false,
    comment: "",
    amount: 0,
    userId: 0,
  });

  const fetchUsers = async () => {
    const users = await ispService.getAllUsers({});
    const usersData = users.items.map((usr) => ({
      text: `${usr.firstName} ${usr.lastName}`,
      key: usr.id,
      value: usr.id,
    }));
    if (mountedRef.current) {
      setUsersData(usersData);
      console.log(`userAcc: ${userAcc}`);
      console.log(`edit: ${edit}`);
      if (userAcc && edit) {
        setFormData({
          firstName: userAcc.firstName,
          lastName: userAcc.lastName,
          paid: userAcc.paid,
          comment: userAcc.comment,
          amount: Number(userAcc.amount),
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    setErr("");
    fetchUsers();
    return () => {
      mountedRef.current = false;
    };
  }, [userAcc, edit]);

  const fillEntity = (key, value) => {
    console.log(key);
    console.log(value);
    setFormData({ ...formData, [key]: value });
    console.log(formData);
  };

  const handlechange = (event, obj) => {
    setFormData({ ...formData, user: obj.value });
  };

  const onAddUserUserAccount = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(err);
    try {
      //const formatedDate = formatDate(new Date(), "yyyy-mm-dd");
      //const today = "YYYY-MM-DD";
      const date = new Date();
      console.log(date);
      const body = { ...formData, billDate: date };
      console.log(`body: ${JSON.stringify(body)}`);
      if (edit) {
        const resp = await ispService.updateUserAcc(userAcc.id, body);
        console.log(`resp:${resp}`);
      } else {
        const resp = await ispService.createUserAccount(body);
        console.log(`resp:${resp}`);
      }
      setSubmitting(false);
      onSubmit();
    } catch (err) {
      console.log(`err: ${err}`);
      setErr(err);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open}>
      <Header>
        {edit ? `${userAcc.firstName} ${userAcc.lastName}` : "Add User"}
      </Header>
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Field>
                  <Form.Select
                    fluid
                    loading={loading}
                    label="User"
                    defaultValue={edit ? userAcc.userId : ""}
                    options={usersData}
                    placeholder="Select User"
                    onChange={handlechange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Paid</label>
                  <Checkbox
                    placeholder="paid"
                    toggle
                    checked={formData.paid}
                    onChange={(e, data) => {
                      fillEntity("paid", data.checked);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Amount</label>
                  <Input
                    placeholder="amount in LBP"
                    value={formData.amount}
                    onChange={(e) => {
                      fillEntity("amount", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>Comment</label>
                  <Input
                    placeholder="add comment..."
                    value={formData.comment}
                    onChange={(e) => {
                      fillEntity("comment", e.target.value);
                    }}
                  />
                </Form.Field>
                <Message negative hidden={err !== "" ? false : true}>
                  <Message.Content>{err}</Message.Content>
                </Message>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Segment style={{ float: "right", padding: "5px" }}>
          <Button
            className="basicStyle"
            loading={submitting}
            icon
            onClick={onAddUserUserAccount}
          >
            {edit ? (
              <div>Save</div>
            ) : (
              <div>
                <Icon name="add" />
                Add
              </div>
            )}
          </Button>
          <Button className="basicStyle" onClick={onClose} icon>
            Cancel
          </Button>
        </Segment>
      </Modal.Actions>
    </Modal>
  );
};

export default AddUserAccountModel;
