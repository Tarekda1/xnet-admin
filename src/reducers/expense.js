import types from '@/_actions/types.js';
import { v4 as uuidv4 } from 'uuid';

// 1. Sets the initial state when the app loads
const initialState = {
    budget: 2000,
    expenses: [
        // { id: uuidv4(), name: 'Shopping', cost: 50 },
        // { id: uuidv4(), name: 'Holiday', cost: 300 },
        // { id: uuidv4(), name: 'Transportation', cost: 70 },
        // { id: uuidv4(), name: 'Fuel', cost: 40 },
        // { id: uuidv4(), name: 'Child Care', cost: 500 },
    ],
};

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'LOAD_EXPENSES':
            return {
                ...state,
                expenses: [...payload],
            };
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, action.payload],
            };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(
                    (expense) => expense.expenseId !== action.payload
                ),
            };
        case 'SET_BUDGET':
            return {
                ...state,
                budget: action.payload,
            };

        default:
            return state;
    }
};
