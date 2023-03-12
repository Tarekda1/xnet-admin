import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo
} from "react";
import { throttle, debounce } from "lodash";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { isMobile } from "react-device-detect";
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
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { customerService } from "@/services";
import { Loading } from "@/components";
import { globalActions } from "@/actions/globalActions";
import { AddEdit } from "./AddEdit";
import "./dashboard.less";
import types from "@/actions/types";

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

const ToolBar = memo(({ onSearchSubmit }) => {
  const [text, settext] = useState("");
  //const [status, setStatus] = useState("all");
  const dispatch = useDispatch();
  const status = useSelector((state) => state.global.status);
  const history = useHistory();
  const [selectedSubscriber, setselectedSubscriber] = useState(-1);
  const [showModal, setshowModal] = useState(false);
  const changeHandler = (e, data) => {
    console.log(data.value);
    settext(data.value);
    if (data.value) {
      onSearchSubmit(data.value, status);
    } else {
      //load all data
      onSearchSubmit("", status);
    }
  };
  const btnStatusHandler = (statusData) => {
    console.log(`status: ${statusData}`);
    //setStatus(statusData)
    dispatch({ type: types.CHANGE_FILTER_STATUS, payload: statusData });
    onSearchSubmit(text, statusData);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 500),
    [text]
  );
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);
  return (
    <Fragment>
      <ZeroPaddingSegment className="toolbar">
        <ZeroPaddingSegment
          className={`${"search__container"} ${"no__margin"}`}
        >
          <Input
            className="search__input"
            icon="search"
            placeholder="Search Client/Details"
            onChange={debouncedChangeHandler}
          />
        </ZeroPaddingSegment>
        <ZeroPaddingSegment>
          <Button.Group>
            <Button onClick={(e, data) => btnStatusHandler("all")} active={status == "all"}>All</Button>
            <Button onClick={() => btnStatusHandler("paid")} active={status == "paid"}>Paid</Button>
            <Button onClick={() => btnStatusHandler("not_paid")} active={status == "not_paid"}>Non Paid</Button>
          </Button.Group>
        </ZeroPaddingSegment>
        <ZeroPaddingSegment className={`${"action__buttons"} ${"no__margin"}`}>
          <Button
            className="btn basicStyle"
            icon
            onClick={(e) => {
              setselectedSubscriber((prev) => -1);
              setshowModal(true);
            }}
          >
            <Icon name="plus" />
            Add Subscriber
          </Button>
          <Button
            className="btn basicStyle"
            icon
            onClick={() => history.push("/admin/importusers")}
          >
            <Icon name="file excel" />
            Import Subscribers
          </Button>
          <AddEdit
            Id={selectedSubscriber}
            onSave={() => {
              setshowModal(false);
              if (selectedSubscriber === -1) {
                fetchUser();
              } else {
                //update user data
                fetchUserById(selectedSubscriber);
              }
            }}
            open={showModal}
            onClose={() => {
              setselectedSubscriber(-1);
              setshowModal(false);
            }}
          />
        </ZeroPaddingSegment>
      </ZeroPaddingSegment>
      <div style={{ clear: "both" }} />
    </Fragment>
  );
});

const Subscribers = ({ subscribers }) => {
  const status = useSelector((state) => state.global.status);
  const loading = useSelector((state) => state.global.showLoading);
  const userInfo = useSelector((state) => state.user.userInfo);
  const tableHeader = [
    "Username",
    "Customer Name",
    "Mobile",
    "Address",
    "Service",
    "Expiry"
  ];
  const nbofPaid = (subscribers) => {
    console.log("updating")
    return subscribers && subscribers.length && subscribers.reduce((acc, subs) => {
      if (subs.subscribtionpaid === true) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };
  return (
    <ZeroPaddingSegment>
      <FlexColumn>
        {loading ? (
          <Loading />
        ) : (
          <ZeroPaddingSegment>
            <ZeroPaddingSegment>
              <strong>Total: </strong>
              {subscribers && subscribers.length}
              {status == "all" && <strong> Total Paid: </strong>}
              {status == "all" && nbofPaid(subscribers)}
            </ZeroPaddingSegment>
            <Table celled striped className="subsriber__table">
              <Table.Header>
                <Table.Row>
                  {tableHeader.map((header, i) => (
                    <Table.HeaderCell
                      style={{ width: i == 5 ? "25%" : "15%" }}
                      key={i}
                    >
                      {header}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {subscribers && subscribers.length && subscribers.map((subscriber, index) => (
                  <CustomerRow
                    key={subscriber.subscriberId}
                    subscriber={subscriber}
                    userInfo={userInfo}
                  />
                ))}
              </Table.Body>
            </Table>
          </ZeroPaddingSegment>
        )}
      </FlexColumn>
    </ZeroPaddingSegment>
  );
};

const CustomerRow = memo(({ subscriber, userInfo }) => {
  const [updating, setUpdating] = useState(false);
  const [subscriptionId, setSusbcriptionId] = useState(-1);
  const status = useSelector((state) => state.global.status);
  const dispatch = useDispatch();
  const postPaid = useCallback(async (subscriberId) => {
    try {
      setSusbcriptionId(subscriberId)
      setUpdating(true);
      const resp = await customerService.postPaid(subscriberId, {
        username: userInfo.username,
      });
      console.log(resp);
      if (resp && resp.code == 200) {
        dispatch(globalActions.updateSubscriber(subscriberId, true))
      }
    } catch (err) {
      console.log(err);
    }
    finally {
      setUpdating(false);
      setSusbcriptionId(-1)
    }

  }, []);

  const postUnPaid = useCallback(async (subscriberId) => {
    console.log("calling unpaid function :)")
    try {
      setSusbcriptionId(subscriberId)
      setUpdating(true);
      const resp = await customerService.postUnPaid(subscriberId, {
        username: userInfo.username,
      });
      console.log(resp);
      if (resp && resp.code == 200) {
        dispatch(globalActions.updateSubscriber(subscriberId, false))
      }
    } catch (err) {
      console.log(err)
    }
    finally {
      setUpdating(false);
      setSusbcriptionId(-1)
    }
  }, []);
  //  async (subscriberId) => {

  // };
  return (
    <Table.Row key={subscriber.subscriberId}>
      <Table.Cell>
        <strong>{subscriber.Username}</strong>
      </Table.Cell>
      <Table.Cell>{subscriber.Name}</Table.Cell>
      <Table.Cell>{subscriber.Mobile}</Table.Cell>
      <Table.Cell>{subscriber.Address}</Table.Cell>
      <Table.Cell>{subscriber.Service}</Table.Cell>
      <Table.Cell>{subscriber.Expiry}</Table.Cell>
      <Table.Cell>{""}</Table.Cell>
      {/* <Table.Cell>
        <Link to={`/customer/step2?customerid=${subscriber.id}`}>{subscriber.Notes}</Link>
      </Table.Cell> */}
    </Table.Row >
  );
});

function index({ history }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const subscribers = useSelector((state) => state.global.filteredSubscribers, [shallowEqual]);
  const dispatch = useDispatch();
  const isVisibleRef = useRef(false);


  useEffect(() => {
    isVisibleRef.current = true;
    dispatch(globalActions.fetchSubscribers());

    return () => {
      isVisibleRef.current = false;
    };
  }, [userInfo]);



  const onSearchSubmit = useCallback((text, status) => {
    console.log("dispatch")
    dispatch(globalActions.shouldLoad(true));
    dispatch(globalActions.filterSusbcribers({ text, status }));
    dispatch(globalActions.shouldLoad(false));
  }, []);

  const onPaidStatusSubmit = useCallback((status) => {
    console.log("dispatch")
    dispatch(globalActions.shouldLoad(true));
    dispatch(globalActions.filterPaidStatus({ value: status }));
    dispatch(globalActions.shouldLoad(false));
  }, []);


  return (
    <BorderLessSegment className="no__padding" style={{ height: "100%" }}>
      {!isMobile && (
        <Segment className={`${"no__border"}`}>
          <Header className="subtitle" as="h2">
            Admin Dashboard
          </Header>
        </Segment>
      )}
      <BorderLessSegment className={`${"no__padding"}`}>
        <>
          <ToolBar onSearchSubmit={onSearchSubmit} onPaidStatusSearch={onPaidStatusSubmit} />
          <Subscribers subscribers={subscribers} />
        </>
      </BorderLessSegment>
    </BorderLessSegment>
  );
}

export default index;
