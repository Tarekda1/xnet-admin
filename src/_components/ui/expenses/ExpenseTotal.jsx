import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

export const ExpenseTotal = () => {
    const expenses = useSelector(state => state.expense.expenses)

    const total = expenses.reduce((total, item) => {
        return (total += (item.cost >= 0 ? 0 : item.cost));
    }, 0);

    return (
        <div class='alert alert-primary p-4'>
            <span><b>Expenses</b></span>
            <p> £{Math.abs(total)}</p>
        </div>
    );
};

export default ExpenseTotal;
