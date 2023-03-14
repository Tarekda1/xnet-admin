import { fetchWrapper, history } from "../helpers";
import constants from "../config/constants";

const baseUrl = `${constants.API_URL}/agent`;

export const agentService = {
  getAll,
  getById,
  create,
  update,
};

function getAll() {
  return fetchWrapper.get(`${baseUrl}/all`).then(
    (agents) => {
      return agents;
    },
    (err) => {
      throw err;
    }
  );
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params, useForm = false, useJson = true) {
  if (useForm) {
    console.log("useform", true);
    return fetchWrapper.postForm(baseUrl, params, useJson);
  }
  return fetchWrapper.post(baseUrl, params, useJson);
}

function update(id, params, useForm = false) {
  if (useForm) {
    return fetchWrapper.putForm(`${baseUrl}/${id}`, params);
  }
  return fetchWrapper.put(`${baseUrl}/${id}`, params);
}
