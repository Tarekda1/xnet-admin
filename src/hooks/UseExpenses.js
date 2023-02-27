import React, { useEffect, useState } from "react";
import { expenseService } from "@/services";

const UseExpenses = (props) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");

  async function fetchExpenses() {
    try {
      setLoading(true);
      const remoteExpenses = await expenseService.getAll();
      console.log(JSON.stringify(remoteExpenses));
      setExpenses(remoteExpenses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      seterror(error);
    }
  }

  async function addExpense(expense) {
    try {
      setLoading(true);
      const remoteExpenses = await expenseService.postExpense(expense);
      console.log(JSON.stringify(remoteExpenses));
      setExpenses((prev) => [...prev, expense]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      seterror(error);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, addExpense, loading, error };
};

export { UseExpenses };
