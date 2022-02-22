import React from 'react';
import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

export const RemainingBudget = () => {
    const expenses = useSelector(state => state.expense.expenses);
    const budget = useSelector(state => state.expense.budget)

    const totalExpenses = expenses.reduce((total, item) => {
        return (total += item.cost);
    }, 0);

    const alertType = totalExpenses > budget ? 'alert-danger' : 'alert-success';

    return (
        <div class={`alert p-4 ${alertType}`}>
            <span><b>Balance</b></span>
            <p> £{totalExpenses}</p>
        </div>
    );
};

export default RemainingBudget;
