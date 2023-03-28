import React, { useEffect, useState, useRef, Fragment } from "react";
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
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import _ from "lodash";
import { debounce } from "lodash";
import { globalActions } from "actions/globalActions";
import { Loading } from "components";
import { Role } from "helpers";
import RevenuePerMonth from "components/ui/revenue_per_month/RevenuePerMonth";
import "./dashboard.scss";

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

const FlexRow = styled(ZeroPaddingSegment)`
  display: flex !important;
  flex-direction: row !important;
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
  const debouncedChangeHandler: any = () => debounce(changeHandler, 500);
  useEffect(() => {
    return () => {
      debouncedChangeHandler?.cancel();
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

function Dashboard() {
  const userInfo = useSelector((state: any) => state?.user.userInfo);
  const subscribers = useSelector(
    (state: any) => state?.global.filteredSubscribers
  );
  const loading = useSelector((state: any) => state?.global.showLoading);
  const loaded = useSelector((state: any) => state?.global.loaded);
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

  const AgentDashBoard = () => {
    return (
      <ZeroPaddingSegment>
        <FlexColumn>
          {loading ? (
            <Loading />
          ) : (
            <FlexColumn>
              <FlexRow>
                <div className="dashboard__box green__box">
                  <div>
                    <Icon name="user"></Icon> Total Users
                  </div>
                  <span>100</span>
                </div>
                <div className="dashboard__box orange__box">
                  <div>
                    <Icon name="user"></Icon> Total Paid Invoices
                  </div>
                  <span>100</span>
                </div>
                <div className="dashboard__box red__box">
                  <div>
                    <Icon name="user"></Icon> Total Plans
                  </div>
                  <span>100</span>
                </div>
                <div className="dashboard__box blue__box">
                  <div>
                    <Icon name="user"></Icon> Total Plans
                  </div>
                  <span>100</span>
                </div>
                <div className="dashboard__box violet__box">
                  <div>
                    <Icon name="user"></Icon> Total Remaining Invoice
                  </div>
                  <span>100</span>
                </div>
              </FlexRow>
              <FlexRow>
                <div style={{ width: "600px" }}>
                  <RevenuePerMonth />
                </div>
              </FlexRow>
            </FlexColumn>
          )}
        </FlexColumn>
      </ZeroPaddingSegment>
    );
  };

  return (
    <Container fluid style={{ height: "100%" }}>
      <Segment className="no__border">
        {!isMobile && (
          <Header className="subtitle" as="h2">
            Admin Dashboard
          </Header>
        )}
      </Segment>
      <ZeroPaddingSegment>
        <Fragment>
          <AgentDashBoard />
        </Fragment>
      </ZeroPaddingSegment>
    </Container>
  );
}

export default Dashboard;
