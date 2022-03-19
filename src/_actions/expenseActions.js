import types from "./types";

export default {
    /**
     * empty payload
     */
    loadExpenses: (data) => {
        return {
            type: types.LOAD_EXPENSES,
            payload: data
        };
    },
    addExpense: (data) => {
        return {
            type: types.ADD_EXPENSE,
            payload: data,
        };
    },
};