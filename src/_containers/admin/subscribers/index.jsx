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
      <List className="toolbar">
        <List.Item>
          <List.Content>
            <Input
              className="search__input"
              icon="search"
              placeholder="Search Client/Details"
              onChange={debouncedChangeHandler}
            />
          </List.Content>
        </List.Item>
        <List.Item floated="right">
          <Button className="btn basicStyle" icon>
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
        </List.Item>
      </List>
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
    return (
      <Table.Row key={subscriber.subscriberId}>
        <Table.Cell>{subscriber.subscribername}</Table.Cell>
        <Table.Cell>{subscriber.username}</Table.Cell>
        <Table.Cell>{subscriber.collectorname}</Table.Cell>
        <Table.Cell>
          <Checkbox
            onChange={(e, data) => {
              if (data.checked) {
                postPaid(subscriber.subscriberId);
              }
            }}
            disabled={subscriber.subscribtionpaid}
            checked={subscriber.subscribtionpaid}
          />
        </Table.Cell>
        <Table.Cell>{subscriber.subscribtionfees}</Table.Cell>
        <Table.Cell>{subscriber.billDate}</Table.Cell>
        <Table.Cell>{subscriber.paymentDate}</Table.Cell>
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
    return (
      <ZeroPaddingSegment>
        <FlexColumn>
          {loading ? (
            <Loading />
          ) : (
            <Table celled striped className="subsriber__table">
              <Table.Header>
                <Table.Row>
                  {tableHeader.map((header, i) => (
                    <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
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
          )}
        </FlexColumn>
      </ZeroPaddingSegment>
    );
  };

  return (
    <Container fluid style={{ height: "100%" }}>
      <Segment className="no__border">
        <Header className="subtitle" as="h2">
          Admin Dashboard
        </Header>
      </Segment>
      <BorderLessSegment>
        <Fragment>
          <ToolBar onSearchSubmit={onSearchSubmit} />
          <Subscribers />
        </Fragment>
      </BorderLessSegment>
    </Container>
  );
}

export default index;
