import React, { useState, useEffect } from "react";
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
} from "semantic-ui-react";
import "./add-user-model.less";
import { ispService } from "@/_services/";
import { showNotification } from "@/_components";
const AddUserModel = ({ open, onSubmit, onClose, edit, selectedIds }) => {
  const [packages, setpackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  //const [user, setUser] = useState({});
  const initialValue = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    package: "",
    address: "",
    isUserActive: false,
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const fetchPackages = async () => {
    try {
      const packages = await ispService.getAllPackages();
      const packagesData = packages.map((pkg) => ({
        text: pkg.displayName,
        key: pkg.id,
        value: pkg.id,
      }));
      setpackages(packagesData);
      if (edit && selectedIds && selectedIds.length > 0) {
        const tempUser = await ispService.getUserById(selectedIds[0]);
        console.log(tempUser);
        tempUser &&
          setFormData({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            phoneNumber: tempUser.phoneNumber,
            package: tempUser.package ? tempUser.package.id : "",
            address: tempUser.address,
            isUserActive: tempUser.isUserActive,
            userName: tempUser.userName,
            email: tempUser.email,
            password: tempUser.password,
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`selectedId: ${[...selectedIds]}`);
    fetchPackages();
    return () => {};
  }, [open]);

  const fillEntity = (key, value) => {
    setFormData({ ...formData, [key]: value });
    console.log(formData);
  };

  const handlechange = (event, obj) => {
    const selectedPackage = packages.filter((pkg) => (pkg.id = obj.value));
    setFormData({ ...formData, package: selectedPackage[0].value });
  };

  const onAddUser = async (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitting(true);
    try {
      let resp;
      if (edit) {
        resp = await ispService.updateUser(selectedIds[0], formData);
      } else {
        resp = await ispService.createUser(formData);
        showNotification({ _title: "Xnet", msg: "User successfuly added" });
      }
      setSubmitting(false);
      onSubmit();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open}>
      <Header>{edit ? "Edit User" : "Add User"}</Header>
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>First Name</label>
                  <Input
                    placeholder="first name"
                    value={formData.firstName}
                    onChange={(e) => {
                      fillEntity("firstName", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <Input
                    placeholder="last name"
                    value={formData.lastName}
                    onChange={(e) => {
                      fillEntity("lastName", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Phone Number</label>
                  <Input
                    placeholder="phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      fillEntity("phoneNumber", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <Input
                    placeholder="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      fillEntity("password", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Is Active</label>
                  <Checkbox
                    placeholder="isActive"
                    checked={formData.isUserActive}
                    onChange={(e) => {
                      fillEntity("isActive", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Field>
                  <Form.Field>
                    <label>Username</label>
                    <Input
                      placeholder="username"
                      value={formData.userName || ""}
                      onChange={(e) => {
                        fillEntity("userName", e.target.value);
                      }}
                    />
                  </Form.Field>
                  <Form.Select
                    fluid
                    loading={loading}
                    label="Package"
                    value={formData.package !== "" ? formData.package : ""}
                    options={packages}
                    placeholder="Select Package"
                    onChange={handlechange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <Input
                    placeholder="email"
                    value={formData.email || ""}
                    onChange={(e) => {
                      fillEntity("email", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address</label>
                  <Input
                    size="large"
                    placeholder="address"
                    value={formData.address || ""}
                    onChange={(e) => {
                      fillEntity("address", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions className="usermodel__actions">
        <div style={{ float: "right", margin: "10px" }}>
          <Button
            className="basicStyle usermodel__actions-button"
            loading={submitting}
            icon
            onClick={(e) => {
              onAddUser(e);
              setFormData(initialValue);
            }}
          >
            {edit ? (
              <React.Fragment>
                <Icon name="save" /> Save
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Icon name="plus" /> Add
              </React.Fragment>
            )}
          </Button>
          <Button
            className="basicStyle usermodel__actions-button"
            onClick={() => {
              setFormData(initialValue);
              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default AddUserModel;
