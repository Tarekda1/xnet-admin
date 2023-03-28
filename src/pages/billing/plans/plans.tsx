import React, {
  memo,
  useEffect,
  Fragment,
  useState,
  useMemo,
  useCallback,
} from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useFetch from "hooks/UseFetch";
import styled from "styled-components";
import { debounce } from "lodash";
import types from "actions/types";
import { AddEdit } from "./AddEdit";
import constants from "config/constants";
import { Loading } from "components";
import "./plans.scss";

interface Plan {
  planId: string;
  speed: string;
  price: number;
  name: string;
  description: string;
}
type Response = [Plan];

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

interface IPlanProps {
  plan: Plan;
  onDelete: (id) => void;
}

const PlanRow: React.FC<IPlanProps> = memo(({ plan, onDelete }) => {
  return (
    <Table.Row key={plan.planId}>
      <Table.Cell>{plan.name}</Table.Cell>
      <Table.Cell>{plan.speed}</Table.Cell>
      <Table.Cell>{plan.price}</Table.Cell>
      <Table.Cell>{plan.description}</Table.Cell>
      <Table.Cell>
        <Button onClick={onDelete}>Delete plan</Button>
      </Table.Cell>
    </Table.Row>
  );
});

const ToolBar: React.FC<any> = memo(({ onSearchSubmit }) => {
  const [text, settext] = useState("");
  const dispatch = useDispatch();
  const status = useSelector((state: any) => state?.global?.status);
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
        <ZeroPaddingSegment className={`search__container no__margin`}>
          <Input
            className="search__input"
            icon="search"
            placeholder="Search Client/Details"
            onChange={debouncedChangeHandler}
          />
        </ZeroPaddingSegment>
        <ZeroPaddingSegment className={`action__buttons no__margin`}>
          <Button
            className="btn basicStyle"
            icon
            onClick={(e) => {
              setselectedSubscriber((prev) => -1);
              setshowModal(true);
            }}
          >
            <Icon name="plus" />
            Add Plan
          </Button>
          <AddEdit
            Id={selectedSubscriber}
            onSave={() => {
              setshowModal(false);
              // if (selectedSubscriber === -1) {
              //   fetchUser();
              // } else {
              //   //update user data
              //   fetchUserById(selectedSubscriber);
              // }
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

const index: React.FC = (props) => {
  const [getPlans, getPlansState] = useFetch<{}, Response>();
  const [deletePlans] = useFetch<{}, Response>();
  const tableHeader = ["Name", "Speed", "Price", "Description"];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getPlans({
      headers: { method: "GET" },
      url: `${constants.API_URL}/billing/plans/all`,
      signal: signal,
    });
    return () => {
      signal.aborted;
    };
  }, []);

  const deletePlanCb = useCallback(async (id: string) => {
    await deletePlans({
      headers: { method: "DELETE" },
      url: `${constants.API_URL}/billing/plans/${id}`,
    });
  }, []);

  return (
    <div>
      {getPlansState.loading ? (
        <Loading />
      ) : (
        <ZeroPaddingSegment>
          <Header textAlign="left" as="h2">
            Billing Plans
          </Header>
          <ZeroPaddingSegment>
            <strong>Total: </strong>
            {getPlansState?.data && getPlansState?.data?.length > 0
              ? getPlansState?.data.length
              : 0}
          </ZeroPaddingSegment>
          <ToolBar />
          <Table celled striped className="plans__table ui celled table">
            <Table.Header>
              <Table.Row>
                {tableHeader.map((header, i) => (
                  <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {getPlansState &&
                getPlansState?.data?.length &&
                getPlansState?.data.map((plan, index) => (
                  <PlanRow
                    plan={plan}
                    key={plan.planId}
                    onDelete={() => {
                      //post to delete
                      deletePlanCb(plan.planId);
                    }}
                  />
                ))}
            </Table.Body>
          </Table>
        </ZeroPaddingSegment>
      )}
    </div>
  );
};

export default index;
