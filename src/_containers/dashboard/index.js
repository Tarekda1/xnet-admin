import React, { useEffect, useState, useRef, Fragment, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Segment,
  Container,
  Header,
  List,
  Input,
  Button,
  Table,
  Icon,
  Checkbox,
} from "semantic-ui-react";
import { Subscriber, Loading } from "@/_components";
import { customerService } from "@/_services";
import styled from "styled-components";
import _ from "lodash";
import "./dashboard.less";
import { globalActions } from "@/_actions/globalActions";
import { Role } from "@/_helpers";
import { debounce } from "lodash";

const BorderLessSegment = styled(Segment)`
  border: none !important;
  box-shadow: none !important;
`;

const ZeroPaddingSegment = styled(BorderLessSegment)`
  padding: 0 !important;
  margin: 0 !imporant;
`;

const FlexColumn = styled(ZeroPaddingSegment)`
  display: flex !important;
  flex-direction: column !important;
`;

const ToolBar = ({ onSearchSubmit }) => {
  const [text, settext] = useState("");
  const changeHandler = (e, data) => {
    console.log(data.value);
    settext(data.value);
    if (data.value) {
      onSearchSubmit(data.value);
    } else {
      //load all data
      onSearchSubmit("");
    }
  };
  const debouncedChangeHandler = () => debounce(changeHandler, 500);
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);
  return (
    <List>
      <List.Item>
        <List.Content>
          <Input
            className="search__input"
            icon="search"
            placeholder="Search Client/Details"
            onChange={debouncedChangeHandler()}
          />
        </List.Content>
      </List.Item>
    </List>
  );
};

function Dashboard({ history }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const subscribers = useSelector((state) => state.global.subscribers);
  const loading = useSelector((state) => state.global.showLoading);
  const dispatch = useDispatch();
  const tableHeader = [
    "اسم المستخدم",
    "رقم المستخدم",
    "اسم قابض الاشتراك",
    "مدفوع",
    "رسم الاشتراك",
    "تاريخ  استحقاق الاشتراك",
    "تاريخ الدفع",
    "ملاحظة",
  ];
  //const [subscribers, setSubscribers] = useState([]);
  //const [loading, setloading] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    isVisibleRef.current = true;
    // async function fetchCustomers() {
    //   setloading(true);
    //   //console.log('agent id', userInfo);
    //   const remoteCustomers = await customerService.getAllCustomers();
    //   console.log("from fetch", remoteCustomers);
    //   if (isVisibleRef.current) {
    //     setSubscribers(remoteCustomers || []);
    //     setloading(false);
    //   }
    // }
    // && _.isEmpty(userInfo.customers)
    if (userInfo.role === Role.Collector) {
      dispatch(globalActions.fetchSubscribers());
    }

    return () => {
      isVisibleRef.current = false;
    };
  }, [userInfo]);

  const onSearchSubmit = async (text) => {
    //setloading(true);
    //console.log('agent id', userInfo);
    let remoteCustomers;

    try {
      dispatch(globalActions.shouldLoad(true));
      if (text) {
        remoteCustomers = await customerService.search(`username=${text}`);
      } else {
        remoteCustomers = await customerService.getAllCustomers();
      }

      console.log("from fetch", remoteCustomers);
      dispatch(globalActions.loadSusbcribers(remoteCustomers || []));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(globalActions.shouldLoad(false));
    }
  };

  const AgentDashBoard = () => {
    return (
      <ZeroPaddingSegment>
        <FlexColumn>
          {loading ? (
            <Loading />
          ) : (
            <Table celled striped className="subscribers__table">
              <Table.Header>
                <Table.Row>
                  {tableHeader.map((header, i) => (
                    <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {subscribers.map((subscriber, index) => (
                  <Subscriber
                    key={subscriber.subscriberId}
                    subscriber={subscriber}
                  />
                ))}
              </Table.Body>
            </Table>
          )}
        </FlexColumn>
      </ZeroPaddingSegment>
    );
  };

  return (
    <Container fluid style={{ height: "100%" }}>
      <Segment className="no__border">
        <Header className="subtitle" as="h2">
          {userInfo && userInfo.role == "ADMIN"
            ? "Admin Dashboard"
            : "لائحة الزبائن"}
        </Header>
      </Segment>
      <BorderLessSegment>
        <Fragment>
          <ToolBar onSearchSubmit={onSearchSubmit} />
          <AgentDashBoard />
        </Fragment>
      </BorderLessSegment>
    </Container>
  );
}

export { Dashboard };
