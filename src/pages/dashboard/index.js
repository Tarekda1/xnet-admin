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
import { Subscriber, Loading } from "../../components";
import styled from "styled-components";
import _ from "lodash";
import "./dashboard.less";
import { globalActions } from "../../actions/globalActions";
import { Role } from "../../helpers";
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
  const subscribers = useSelector((state) => state.global.filteredSubscribers);
  const loading = useSelector((state) => state.global.showLoading);
  const loaded = useSelector((state) => state.global.loaded);
  const dispatch = useDispatch();
  const tableHeader = [
    "CustomerID",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "Plan",
    "Plan Date",
    "Status",
  ];
  const isVisibleRef = useRef(false);

  useEffect(() => {
    isVisibleRef.current = true;
    if (userInfo.role === Role.Collector) {
      dispatch(globalActions.fetchSubscribers());
    }

    return () => {
      isVisibleRef.current = false;
    };
  }, [userInfo]);

  useEffect(() => {
    console.log("filtering not paid");
    if (loading == false && !_.isEmpty(subscribers))
      dispatch(
        globalActions.filterSusbcribers({ status: "not_paid", text: "" })
      );
    return () => {};
  }, [loading]);

  const onSearchSubmit = (text) => {
    try {
      console.log("dispatch");
      dispatch(globalActions.filterSusbcribers({ value: text }));
    } catch (error) {
      console.log(error);
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
                {subscribers &&
                  subscribers.map((subscriber, index) => (
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
          لائحة الزبائن
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
