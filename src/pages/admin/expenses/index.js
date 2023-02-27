import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Segment, List } from "semantic-ui-react";
import {
  AddExpenseForm,
  Budget,
  ExpenseList,
  ExpenseTotal,
  RemainingBudget,
} from "@/components";
import expenseActions from "@/actions/expenseActions";
import { UseExpenses } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";

const Expenses = ({ match }) => {
  const dispatch = useDispatch();
  const { expenses, error, loading } = UseExpenses();
  useEffect(() => {
    if (error == "" && !loading && expenses.length > 0) {
      console.log(`expense: ${expenses.length}`);
      dispatch(expenseActions.loadExpenses(expenses));
    }
    return () => {};
  }, [loading]);
  return (
    <Segment basic style={{ maxWidth: "330px" }}>
      <h1 className="mt-3">My Budget Planner</h1>
      <List divided horizontal size={"big"}>
        <List.Item>
          <List.Content>
            <Budget />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <RemainingBudget />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <ExpenseTotal />
          </List.Content>
        </List.Item>
      </List>
      <h3 className="mt-3">Expenses</h3>
      <div className="row ">
        <div className="col-sm">
          <ExpenseList />
        </div>
      </div>
      <h3
        className="addexpense__title"
        style={{
          margin: "15px 0px",
          borderBottom: "1px solid lightgray",
          paddingBottom: "5px",
        }}
      >
        Add Expense
      </h3>
      <div className="row mt-3">
        <div className="col-sm">
          <AddExpenseForm />
        </div>
      </div>
    </Segment>
  );
};

export default Expenses;
