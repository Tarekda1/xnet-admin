import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

const ExpenseItem = (props) => {
    const dispatch = useDispatch();

    const handleDeleteExpense = () => {
        dispatch({
            type: 'DELETE_EXPENSE',
            payload: props.id,
        });
    };

    return (
        <li class='list-group-item d-flex justify-content-between align-items-center'>
            {props.name}
            <div>
                <span class='badge badge-primary badge-pill mr-3'>£{props.cost}</span>
                <i class="trash icon" size='1.5em' onClick={handleDeleteExpense} />
            </div>
        </li>
    );
};

export default ExpenseItem;
