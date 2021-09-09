import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { throttle, debounce } from "lodash";
import { getdashboardMenu, Role } from "@/_helpers";
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
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { customerService } from "@/_services";
import { Loading } from "@/_components";
import { AddEdit } from "./AddEdit";
import "./dashboard.less";

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
  const history = useHistory();
  const [selectedSubscriber, setselectedSubscriber] = useState(-1);
  const [showModal, setshowModal] = useState(false);
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
};

function index({ history }) {
  const userInfo = useSelector((state) => state.user.userInfo);
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
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setloading] = useState(false);
  const isVisibleRef = useRef(false);

  const fetchCustomers = useCallback(async () => {
    setloading(true);
    const remoteCustomers = await customerService.getAllCustomers();
    console.log("from fetch", remoteCustomers);
    if (isVisibleRef.current) {
      setSubscribers(remoteCustomers || []);
      setloading(false);
    }
  }, []);

  useEffect(() => {
    isVisibleRef.current = true;

    // && _.isEmpty(userInfo.customers)
    fetchCustomers();

    return () => {
      isVisibleRef.current = false;
    };
  }, [userInfo]);

  const CustomerRow = ({ subscriber }) => {
    const postPaid = async (subscriberId) => {
      setloading(true);
      const resp = await customerService.postPaid(subscriberId, {
        username: userInfo.username,
      });
      console.log(resp);
      if (resp && resp.code == 200) {
        setSubscribers((prevSubs) => {
          let selected = prevSubs.find(
            (subs) => subs.subscriberId == subscriberId
          );
          selected.subscribtionpaid = true;
          return [...prevSubs];
        });
      }
      setloading(false);
    };

    const postUnPaid = useCallback(async (subscriberId) => {
      setloading(true);
      const resp = await customerService.postUnPaid(subscriberId, {
        username: userInfo.username,
      });
      console.log(resp);
      if (resp && resp.code == 200) {
        setSubscribers((prevSubs) => {
          let selected = prevSubs.find(
            (subs) => subs.subscriberId == subscriberId
          );
          selected.subscribtionpaid = false;
          return [...prevSubs];
        });
      }
      setloading(false);
    }, []);
    //  async (subscriberId) => {

    // };
    return (
      <Table.Row key={subscriber.subscriberId}>
        <Table.Cell>
          <strong>{subscriber.subscribername}</strong>
        </Table.Cell>
        <Table.Cell>{subscriber.username}</Table.Cell>
        <Table.Cell>{subscriber.collectorname}</Table.Cell>
        <Table.Cell>
          <Checkbox
            onChange={(e, data) => {
              if (data.checked) {
                postPaid(subscriber.subscriberId);
              } else {
                postUnPaid(subscriber.subscriberId);
              }
            }}
            checked={subscriber.subscribtionpaid}
          />
        </Table.Cell>
        <Table.Cell>{subscriber.subscribtionfees}</Table.Cell>
        <Table.Cell>{subscriber.billDate}</Table.Cell>
        <Table.Cell>{subscriber.paymentDate}</Table.Cell>
        <Table.Cell>{""}</Table.Cell>
        {/* <Table.Cell>
					<Link to={`/customer/step2?customerid=${subscriber.id}`}>{subscriber.Notes}</Link>
				</Table.Cell> */}
      </Table.Row>
    );
  };

  const onSearchSubmit = async (text) => {
    setloading(true);
    //console.log('agent id', userInfo);
    let remoteCustomers;
    try {
      if (text) {
        remoteCustomers = await customerService.search(`username=${text}`);
      } else {
        remoteCustomers = await customerService.getAllCustomers();
      }

      console.log("from fetch", remoteCustomers);
      setSubscribers(remoteCustomers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const Subscribers = () => {
    const nbofPaid = () => {
      return subscribers.reduce((acc, subs) => {
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
                {subscribers.length}
                <strong> Total Paid: </strong>
                {nbofPaid()}
              </ZeroPaddingSegment>
              <Table celled striped className="subsriber__table">
                <Table.Header>
                  <Table.Row>
                    {tableHeader.map((header, i) => (
                      <Table.HeaderCell
                        style={{ width: i == 7 ? "25%" : "12%" }}
                        key={i}
                      >
                        {header}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {subscribers.map((subscriber, index) => (
                    <CustomerRow
                      key={subscriber.subscriberId}
                      subscriber={subscriber}
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
        <Fragment>
          <ToolBar onSearchSubmit={onSearchSubmit} />
          <Subscribers />
        </Fragment>
      </BorderLessSegment>
    </BorderLessSegment>
  );
}

export default index;
