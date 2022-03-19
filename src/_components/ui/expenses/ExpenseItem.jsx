import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { List, Segment } from 'semantic-ui-react';
import styled from "styled-components";
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
    const dispatch = useDispatch();

    const handleDeleteExpense = () => {
        dispatch({
            type: 'DELETE_EXPENSE',
            payload: props.id,
        });
    };
    const sign = cost < 0 ? '-' : '+';

    return (
        <List.Item className={cost < 0 ? 'expense__item expense__minus' : 'expense__item expense__plus'}>
            <List.Content basic floated='left'>{name}</List.Content>
            <List.Content basic floated='right'>
                {sign}{moneyFormatter(cost)}
                <i class="trash icon" size='1.5em' style={{ marginLeft: "10px", zIndex: 1000 }} onClick={handleDeleteExpense} />
            </List.Content>
        </List.Item>
    );
};

export default ExpenseItem;
