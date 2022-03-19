import { BehaviorSubject } from "rxjs";
import { fetchWrapper, history } from "@/_helpers";
import { getToken, clearToken } from "@/_helpers";
const userSubject = new BehaviorSubject(null);
const config = require("config");
const baseUrl = `${config.apiUrl}/expenses`;

export const expenseService = {
    getAll,
    postExpense
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/all`).then(
        (expenses) => expenses,
        (err) => {
            throw err;
        }
    );
}

function postExpense(params) {
    return fetchWrapper.post(`${baseUrl}`, params, true);
}