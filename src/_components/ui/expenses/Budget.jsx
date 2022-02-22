import React, { useState } from 'react';
import ViewBudget from './ViewBudget';
import EditBudget from './EditBudget';
import { useDispatch, useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

export const Budget = () => {
    const dispatch = useDispatch();
    const budget = useSelector(state => state.expense.expenses)
        .reduce((acc, expense) => acc + (expense.cost <= 0 ? 0 : expense.cost), 0);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = (value) => {
        dispatch({
            type: 'SET_BUDGET',
            payload: value,
        });
        setIsEditing(false);
    };

    return (
        <div class='alert alert-secondary p-3 d-flex align-items-center justify-content-between'>
            {isEditing ? (
                <EditBudget handleSaveClick={handleSaveClick} budget={budget} />
            ) : (
                // For part 1 render component inline rather than create a seperate one
                <ViewBudget handleEditClick={handleEditClick} budget={budget} />
            )}
        </div>
    );
};

