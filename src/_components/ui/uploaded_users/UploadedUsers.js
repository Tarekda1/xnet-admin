import React, { useEffect, useState } from "react";

import { Checkbox, Tab, Table } from "semantic-ui-react";

const UploadedUsers = ({ headerData, body, enableAction }) => {
  //const header = ["username", "first name", "last name", "email", "address"];
  const [selectedIndexId, setSelectedIndexId] = useState(-1);
  const handleChange = (e, data, index) => {
    if (data.checked) {
      setSelectedIndexId(index);
      enableAction(true, index);
    } else {
      setSelectedIndexId(-1);
      enableAction(false, -1);
    }
  };

  useEffect(() => {
    setSelectedIndexId(-1);
  }, [body.length]);

  return (
    <React.Fragment>
      <Table>
        <Table.Header>
          <Table.Row>
            {<Table.HeaderCell>{""}</Table.HeaderCell>}
            {headerData &&
              headerData.length > 0 &&
              headerData.map((key, index) => (
                <Table.HeaderCell key={index}>{key}</Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {body.map((row, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  <Checkbox
                    checked={selectedIndexId === index}
                    onChange={(e, d) => handleChange(e, d, index)}
                  />
                </Table.Cell>
                {row.map((col, subIndex) => {
                  return <Table.Cell key={subIndex}>{col}</Table.Cell>;
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};

export { UploadedUsers };
