import React, { useEffect, useState } from "react";
import { accountService } from "@/_services";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [error, seterror] = useState("");

  async function fetchUser() {
    try {
      setLoading(true);
      const usersFromServer = await accountService.getAll();
      setUsers(usersFromServer.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      seterror(error);
    }
  }

  async function fetchUserById(id) {
    try {
      const { user } = await accountService.getById(id);
      console.log("updated user", user.userId);
      console.log(users);
      if (user) {
        let tempUsers = [...users];
        const foundIndex = tempUsers.findIndex(
          (uservalue) => uservalue.userId == user.userId
        );

        tempUsers[foundIndex] = user;
        setUsers((prevUsers) => [...tempUsers]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function deleteUser() {
    //show confirmation before delete
    setOpenDelete(false);
    setUsers(
      users.map((x) => {
        if (x.id === selectedIdForDelete) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    accountService.delete(selectedIdForDelete).then((response) => {
      setUsers((users) => users.filter((x) => x.id !== selectedIdForDelete));
      setOpenDelete(false);
    });
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { users, loading, error, openDelete, deleteUser, fetchUserById };
};

export { useUsers };
