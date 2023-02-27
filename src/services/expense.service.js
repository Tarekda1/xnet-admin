import { BehaviorSubject } from "rxjs";
import { fetchWrapper, history } from "@/helpers";
import { getToken, clearToken } from "@/helpers";
import { func } from "prop-types";
const userSubject = new BehaviorSubject(null);
const config = require("config");
const baseUrl = `${config.apiUrl}/expenses`;

export const expenseService = {
  getAll,
  postExpense,
  deleteExpense,
};

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

function deleteExpense(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`, null, true);
}
