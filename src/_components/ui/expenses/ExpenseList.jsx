import React, { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem';
import { useSelector } from 'react-redux';
import { Input, List } from 'semantic-ui-react';

export const ExpenseList = () => {
    const expenses = useSelector(state => state.expense.expenses)

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
                onChange={handleChange}
            />
            <List divided verticalAlign='middle'>
                {filteredExpenses.map((expense) => (
                    <List.Item>
                        <List.Content>
                            <ExpenseItem
                                id={expense.id}
                                name={expense.name}
                                cost={expense.cost}
                            />
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    );
};

