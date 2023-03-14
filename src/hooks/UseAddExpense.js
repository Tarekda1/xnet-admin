import React, { useEffect, useState } from "react";
import { expenseService } from "../services";

const UseAddExpense = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");

  async function addExpense(expense) {
    try {
      setLoading(true);
      const remoteExpenses = await expenseService.postExpense(expense);
      console.log(JSON.stringify(remoteExpenses));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      seterror(error);
    }
  }

  // useEffect(() => {
  //     fetchExpenses();
  // }, []);

  return { addExpense, loading, error };
};

export { UseAddExpense };
