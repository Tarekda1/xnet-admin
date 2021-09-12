import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountService } from "@/_services";
import { Loading } from "@/_components";
import { Segment, Table, Button, Icon, Confirm } from "semantic-ui-react";
import { AddEdit } from "./AddEdit";
import { useUsers } from "@/_hooks";
import "./List.less";

const UsersTableHeader = (props) => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell style={{ width: "20%" }}>Name</Table.HeaderCell>
        <Table.HeaderCell style={{ width: "25%" }}>Email</Table.HeaderCell>
        <Table.HeaderCell style={{ width: "10%" }}>
          Is Verified
        </Table.HeaderCell>
        <Table.HeaderCell style={{ width: "20%" }}>Created At</Table.HeaderCell>
        <Table.HeaderCell style={{ width: "20%" }}>Role</Table.HeaderCell>
        <Table.HeaderCell style={{ width: "40%" }} />
      </Table.Row>
    </Table.Header>
  );
};

function List({ match }) {
  const { path } = match;
  const { users, loading, error, openDelete, deleteUser, fetchUserById } =
    useUsers();
  const isVisibleRef = useRef(true);
  const [selectedUserId, setselectedUserId] = useState(-1);
  const [showModal, setshowModal] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState(-1);

  return (
    <Segment basic style={{ padding: "0" }}>
      <div>
        <Segment style={{ paddingLeft: "0" }} basic floated="left">
          <h1>Portal Users</h1>
          <p>Secured only accessible by admin</p>
        </Segment>
        <Segment padded={false} basic floated="right">
          <Button
            icon
            className="btn basicStyle"
            onClick={(e) => {
              setselectedUserId((prev) => -1);
              setshowModal(true);
            }}
          >
            <Icon name="plus" /> Add User
          </Button>
        </Segment>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Table className="table table-striped users">
          <UsersTableHeader />
          <Table.Body>
            {users && users.length > 0 ? (
              users.map((user) => (
                <Table.Row className="users__row" key={user.userId}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isVerified ? "true" : "false"}</Table.Cell>
                  <Table.Cell>{user.created}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell tyle={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Button
                        icon
                        className="basicStyle"
                        onClick={() => {
                          setselectedUserId(user.email);
                          setTimeout(() => {
                            setshowModal(true);
                          }, 100);
                        }}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedIdForDelete(user.email);
                          setOpenDelete(true);
                        }}
                        className="basicStyle users__row-delete"
                        icon
                        loading={user.isDeleting}
                        disabled={user.role === "Admin" || user.isDeleting}
                      >
                        <Icon name="trash" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <td>
                  no users found <br />
                  <Button>Add User Account</Button>
                </td>
              </Table.Row>
            )}
            {!users && (
              <Table.Row>
                <td colSpan="4" className="text-center">
                  <span className="spinner-border spinner-border-lg align-center" />
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      <AddEdit
        Id={selectedUserId}
        onSave={() => {
          setshowModal(false);
          if (selectedUserId === -1) {
            fetchUser();
          } else {
            //update user data
            fetchUserById(selectedUserId);
          }
        }}
        open={showModal}
        onClose={() => {
          setselectedUserId(-1);
          setshowModal(false);
        }}
      />
      <Confirm
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => {}}
      />
    </Segment>
  );
}

export { List };
