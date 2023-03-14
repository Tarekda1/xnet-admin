import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Options, HeaderListTemplate } from "./Constants";
import {
  Segment,
  Table,
  Tab,
  Header,
  Container,
  Grid,
  Button,
  Checkbox,
  Icon,
  Dropdown,
  Message,
} from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { globalActions } from "../../../actions/globalActions";
import { UploadFile } from "../../../components/ui/upload_file/UploadFile";
import DataHelper from "../../../helpers/excel-helper";
import { UploadedUsers } from "../../../components";
import { Loading } from "../../../components";
import { customerService } from "../../../services";
import "./importusers.scss";

const BorderLessSegment = styled(Segment)`
  border: none !important;
  box-shadow: none !important;
`;

const ImportUsers = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.global.showLoading);
  const [selected, setSelected] = useState([]);
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [header, setHeader] = useState([]);
  const [showUserModel, setShowUserModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dropDownRef = useRef(null);
  const excelHelper = new DataHelper();
  const uploadRef = useRef(null);
  const history = useHistory();

  const handleOnDropDownAction = (e, data) => {
    console.log(data.value);
    console.log([...selected]);
    switch (data.value) {
      case "edit":
        setIsEdit(true);
        setShowUserModel(true);
        break;
      case "delete":
        //remove selected User
        deleteSelectedUser(selected[0]);
        break;
    }
  };

  const deleteSelectedUser = async (index) => {
    try {
      // console.log(`index: ${index}`);
      // console.log(selected);
      //show loading before
      if (selected.length == 0) {
        //show error (no item selected)
        //console.log(`error no item selected`);
        return;
      }
      dispatch(globalActions.shouldLoad(true));
      uploadedUsers.splice(index, 1);
      console.log(uploadedUsers);
      setUploadedUsers(uploadedUsers);
      dispatch(globalActions.shouldLoad(false));
      console.log("deleted");
    } catch (err) {
      console.log(`err: ${err}`);
    } finally {
      //hide loading
      setSelected([]);
      if (dropDownRef) dropDownRef.current.clearValue();
    }
  };

  const handleUpload = async (e) => {
    //console.log(e.target.files[0]);
    dispatch(globalActions.shouldLoad(true));
    const { header, data } = await excelHelper.parseExcelFile(
      e.target.files[0]
    );
    setHeader(header);
    setUploadedUsers(data);
    dispatch(globalActions.shouldLoad(false));
  };

  const handleSelect = (shouldEnable, selectedId) => {
    if (shouldEnable) {
      console.log(`should enable and add id: ${selectedId}`);
      setSelected((prevState) => [selectedId]);
    } else {
      if (selectedId === -1) {
        setSelected([]);
        dropDownRef.current.clearValue();
      }
    }
  };

  const onSave = async () => {
    try {
      //show loading
      dispatch(globalActions.shouldLoad(true));
      setIsSaving(true);
      console.log(typeof uploadedUsers);
      // const jsonObj = excelHelper.parseRows(uploadedUsers, header);
      // //console.log(jsonObj);
      const resp = await customerService.createBatch(uploadedUsers);
      console.log(resp);
      if (resp && (resp.code === 200 || resp.messsage.indexOf("success"))) {
        console.log(resp?.code);
        //history.push("/admin");
        window.location = "/admin";
      }
      //hide loading
      dispatch(globalActions.shouldLoad(false));
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
      dispatch(globalActions.shouldLoad(false));
    }
  };

  return (
    <Container className="importedUserslist" fluid style={{ padding: "10px" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column floated="left" width={4}>
            <div className="header">
              <Header as="h1" className="importedUserslist__header">
                Import users
              </Header>
            </div>
          </Grid.Column>
          <Grid.Column floated="right" width={12}>
            <div>
              <Button
                floated="right"
                icon
                loading={isSaving}
                className="userslist__action-button basicStyle"
                onClick={onSave}
              >
                <Icon name="disk" /> Save
              </Button>
              <Button
                floated="right"
                icon
                className="userslist__action-button basicStyle"
                onClick={(_) => {
                  console.log(uploadRef);
                  uploadRef.current.click();
                }}
              >
                <Icon name="file excel" /> Import new file
              </Button>
              <Dropdown
                className="button icon actionsgroup__dropdown right floated basicStyle"
                style={{ padding: "5px !important" }}
                ref={dropDownRef}
                disabled={selected.length == 0}
                onChange={(e, d) => {
                  handleOnDropDownAction(e, d);
                }}
                options={Options}
                trigger={
                  <Button
                    content="Actions"
                    disabled={selected.length == 0}
                    className="actionsgroup__button"
                  />
                }
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment className="uploadsegment">
              <div className="uploadwrapper">
                <UploadFile
                  button={{}}
                  visible={uploadedUsers.length == 0}
                  inputRef={uploadRef}
                  input={{
                    id: "upload",
                    onInput: handleUpload,
                  }}
                />
              </div>
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  uploadedUsers.length > 0 && (
                    <UploadedUsers
                      headerData={header}
                      body={uploadedUsers}
                      enableAction={handleSelect}
                    />
                  )
                )}
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default ImportUsers;
