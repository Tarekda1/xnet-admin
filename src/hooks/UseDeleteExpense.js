import React, { useEffect, useState } from "react";
import { expenseService } from "@/services";

const UseDeleteExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");

  async function deleteExpense(id) {
    try {
      setLoading(true);
      const remoteExpenses = await expenseService.deleteExpense(id);
      console.log(JSON.stringify(remoteExpenses));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      seterror(error);
    }
  }

  return { deleteExpense, loading, error };
};

export { UseDeleteExpense };
