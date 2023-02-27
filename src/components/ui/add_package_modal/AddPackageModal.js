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
import "./add-package-model.less";
import { ispService } from "@/_services/";
const AddPackageModal = ({ open, onSubmit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const onAddPackage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await ispService.createPackage({ displayName });
      setSubmitting(false);
      onSubmit();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      // onClose={() => setshowModel(false)}
      // onOpen={() => setshowModel(true)}
    >
      <Header>Add Package</Header>
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>Package Name</label>
                  <Input
                    placeholder="Package name"
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions className="packagemodel__actions">
        <div style={{ float: "right", margin: "10px" }}>
          <Button
            icon
            className="basicStyle packagemodel__actions-button"
            loading={submitting}
            onClick={onAddPackage}
          >
            <Icon name="plus" /> Add
          </Button>
          <Button
            className="basicStyle packagemodel__actions-button"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default AddPackageModal;
