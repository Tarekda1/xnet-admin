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
import { useNavigate } from "react-router-dom";
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
  onEdit: (id) => void;
}

const PlanRow: React.FC<IPlanProps> = memo(({ plan, onDelete, onEdit }) => {
  return (
    <Table.Row key={plan.planId}>
      <Table.Cell>{plan.name}</Table.Cell>
      <Table.Cell>{plan.speed}</Table.Cell>
      <Table.Cell>{plan.price}</Table.Cell>
      <Table.Cell>{plan.description}</Table.Cell>
      <Table.Cell>
        <Button onClick={onDelete}>Delete</Button>
        <Button onClick={onEdit}>Edit</Button>
      </Table.Cell>
    </Table.Row>
  );
});

const ToolBar: React.FC<any> = memo(
  ({ onSearchSubmit, onSaveHandler, onAdd }) => {
    const [text, settext] = useState("");
    const dispatch = useDispatch();
    const status = useSelector((state: any) => state?.global?.status);
    const navigate = useNavigate();
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
            <Button className="btn basicStyle" icon onClick={onAdd}>
              <Icon name="plus" />
              Add Plan
            </Button>
          </ZeroPaddingSegment>
        </ZeroPaddingSegment>
        <div style={{ clear: "both" }} />
      </Fragment>
    );
  }
);

const index: React.FC = (props) => {
  const [getPlans] = useFetch<{}, Response>();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [deletePlans] = useFetch<{}, Response>();
  const [selectedSubscriber, setselectedSubscriber] = useState("");
  const [showModal, setshowModal] = useState(false);
  const tableHeader = ["Name", "Speed", "Price", "Description"];

  async function getPlansAsync(signal, setloadingCb) {
    setloadingCb(true);
    const plans = await getPlans({
      headers: { method: "GET" },
      url: `${constants.API_URL}/billing/plans/all`,
      signal: signal,
    });
    setPlans(plans);
    setloadingCb(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getPlansAsync(signal, setLoading);
    return () => {
      signal.aborted;
    };
  }, []);

  useEffect(() => {
    if (showModal === true) return;
    const controller = new AbortController();
    const signal = controller.signal;
    getPlansAsync(signal, setRefreshLoading);
    return () => {
      signal.aborted;
    };
  }, [showModal]);

  const deletePlanCb = useCallback(async (id: string) => {
    await deletePlans({
      headers: { method: "DELETE" },
      url: `${constants.API_URL}/billing/plans/${id}`,
    });
  }, []);

  const editPlanCb = useCallback(async (id: string) => {
    console.log(`plan id: ${id}`);
    setselectedSubscriber(id);
    setshowModal(true);
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <ZeroPaddingSegment>
          <Header textAlign="left" as="h2">
            Billing Plans
          </Header>
          <ZeroPaddingSegment>
            <strong>Total: </strong>
            {plans && plans?.length > 0 ? plans?.length : 0}
          </ZeroPaddingSegment>
          <ToolBar
            onSaveHandler={getPlans}
            onAdd={(e) => {
              setselectedSubscriber("");
              setshowModal(true);
            }}
          />
          <Table celled striped className="plans__table ui celled table">
            <Table.Header>
              <Table.Row>
                {tableHeader.map((header, i) => (
                  <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {plans &&
                plans?.length &&
                plans?.map((plan, index) => (
                  <PlanRow
                    plan={plan}
                    key={`id__${plan.planId}`}
                    onDelete={() => {
                      //post to delete
                      deletePlanCb(plan.planId);
                    }}
                    onEdit={() => {
                      console.log(`planId: ${plan.planId}`);
                      editPlanCb(plan.planId);
                    }}
                  />
                ))}
            </Table.Body>
          </Table>
          <AddEdit
            Id={selectedSubscriber}
            onSave={() => {
              setshowModal(false);
            }}
            open={showModal}
            onClose={() => {
              setselectedSubscriber("");
              setshowModal(false);
            }}
          />
        </ZeroPaddingSegment>
      )}
    </div>
  );
};

export default index;
