import React, { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem';
import { useSelector } from 'react-redux';
import { Input, List } from 'semantic-ui-react';
import "./expenseform.less"

export const ExpenseList = () => {
    const expenses = useSelector(state => state.expense.expenses);
    const [filteredExpenses, setfilteredExpenses] = useState(expenses || []);

    useEffect(() => {
        setfilteredExpenses(expenses);
    }, [expenses]);

    const handleChange = (event) => {
        const searchResults = expenses.filter((filteredExpense) =>
            filteredExpense.name.toLowerCase().includes(event.target.value)
        );
        setfilteredExpenses(searchResults);
    };

    return (
        <>
            <Input
                type='text'
                icon="search"
                placeholder='Type to search...'
                className='form__input'
                onChange={handleChange}
            />
            <List className='list__expense' divided verticalAlign='middle'>
                {filteredExpenses.length > 0 && filteredExpenses.map((expense) => (
                    <ExpenseItem
                        key={expense.expenseId}
                        id={expense.expenseId}
                        name={expense.name}
                        cost={expense.value}
                    />
                ))}
            </List>
        </>
    );
};

