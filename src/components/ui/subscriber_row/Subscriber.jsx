import React from "react";
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
import { globalActions } from "../../../actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import { customerService } from "../../../services";

const Subscriber = ({ subscriber }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const postPaid = async (subscriberId) => {
    dispatch(globalActions.shouldLoad(true));
    const resp = await customerService.postPaid(subscriberId, {
      username: userInfo.username,
    });
    console.log(resp);
    if (resp && resp.code == 200) {
      dispatch(globalActions.updateSubscriber(subscriberId));
    }
  };
  return (
    <Table.Row fluid="true" key={subscriber.subscriberId}>
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
            }
          }}
          disabled={subscriber.subscribtionpaid}
          checked={subscriber.subscribtionpaid}
        />
      </Table.Cell>
      <Table.Cell>{subscriber.subscribtionfees}</Table.Cell>
      <Table.Cell>{subscriber.billDate}</Table.Cell>
      <Table.Cell>{subscriber.paymentDate}</Table.Cell>
      <Table.Cell style={{ width: "15%" }}>{subscriber.notes}</Table.Cell>
      {/* <Table.Cell>
					<Link to={`/customer/step2?customerid=${subscriber.id}`}>{subscriber.Notes}</Link>
				</Table.Cell> */}
    </Table.Row>
  );
};

export { Subscriber };
