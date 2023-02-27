import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppSidebar, TopNavigation, PrivateRoute, Alert } from "@/components";
import { accountService } from "@/_services";
import {
  Segment,
  Image,
  Grid,
  Container,
  Table,
  Header,
  Label,
} from "semantic-ui-react";
import { Loading, Avatar } from "@/components";
import "./profile.css";
function Details({ match }) {
  const { path } = match;
  //const userFromStorage = localStorage.getItem('user') !== '' ? JSON.parse(localStorage.getItem('user')) : null;
  const user = useSelector((state) => state.user.userInfo);
  const [profile, setProfile] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const remoteProfile = await accountService.getById(user.id);
        setProfile(remoteProfile);
      } catch (err) {
        console.log(err);
        if (err === "Unauthorized") {
          const remoteProfile = await accountService.refreshToken();
          setProfile(remoteProfile);
        }
      }
      setLoadingData(false);
    }
    if (user) {
      fetchProfile();
    }

    return () => {};
  }, []);

  return !loadingData ? (
    profile ? (
      <Container fluid style={{ padding: "15px" }}>
        <Segment className="profile" style={{ padding: "40px" }}>
          <Grid>
            <Grid.Column width={4}>
              <Avatar className="profile__avatar" />
            </Grid.Column>
            <Grid.Column width={9}>
              <Table className="profileTable">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h2" className="profileTable__name">
                        {profile.firstName} {profile.lastName}
                      </Header>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong className="profileTable__header">Email</strong>
                      <br /> <p>{profile.email}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong className="profileTable__header">User Id</strong>
                      <br /> <p>{profile.id}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong className="profileTable__header">
                        Is Verified
                      </strong>
                      <br />{" "}
                      <p> {profile.isVerified ? "Verified" : "Not Verified"}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <strong className="profileTable__header">Role</strong>
                      <br /> <p>{profile.role}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Link
                        to={`${path}/update`}
                        className="profile__action basicStyle"
                      >
                        Update Profile
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    ) : (
      "No Data For Profile"
    )
  ) : (
    <Loading />
  );
}

export { Details };
