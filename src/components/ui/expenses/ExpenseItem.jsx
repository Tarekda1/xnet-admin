import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, List, Icon } from 'semantic-ui-react';
import { UseDeleteExpense } from "@/hooks";
import "./expenseform.less"

function moneyFormatter(num) {
    if (!num) return "";
    let p = num.toFixed(2).split('.');
    return (
        '$ ' +
        p[0]
            .split('')
            .reverse()
            .reduce(function (acc, num, i, orig) {
                return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
            }, '') +
        '.' +
        p[1]
    );
}


const ExpenseItem = ({ name, cost, id }) => {
    const { deleteExpense, error, loading } = UseDeleteExpense();
    const dispatch = useDispatch();

    const handleDeleteExpense = async () => {
        await deleteExpense(id);
        dispatch({
            type: 'DELETE_EXPENSE',
            payload: id,
        });
    };
    const sign = cost < 0 ? '-' : '+';

    return (
        <List.Item className={cost < 0 ? 'expense__item expense__minus' : 'expense__item expense__plus'}>
            <List.Content basic floated='left'>{name}</List.Content>
            <List.Content basic floated='right'>
                {sign}{moneyFormatter(cost)}
                <Button loading={loading}
                    style={{ marginLeft: "10px", padding: "2px", zIndex: 1000, background: "none" }}
                    onClick={handleDeleteExpense}>
                    <Icon name='trash' />
                </Button>
            </List.Content>
        </List.Item>
    );
};

export default ExpenseItem;
