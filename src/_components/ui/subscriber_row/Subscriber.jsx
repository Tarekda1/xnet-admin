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
import { useSelector } from "react-redux";
import { customerService } from "@/_services";

const Subscriber = ({ subscriber, setloading }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
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
    <Table.Row fluid key={subscriber.subscriberId}>
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
