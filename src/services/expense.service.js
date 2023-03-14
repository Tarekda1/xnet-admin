import { fetchWrapper } from "../helpers";
import constants from "../config/constants";

const baseUrl = `${constants.API_URL}/expenses`;

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
