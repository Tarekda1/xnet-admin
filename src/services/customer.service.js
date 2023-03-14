import { fetchWrapper } from "../helpers";
import constants from "../config/constants";

export const customerService = {
  getAllCustomers,
  getById,
  create,
  update,
  search,
  postPaid,
  postUnPaid,
  createBatch,
};

const baseUrl = `${constants.API_URL}/subscribers`;

function getAllCustomers(offset = 0) {
  return fetchWrapper.get(`${baseUrl}/all?offset=${offset}`).then(
    (agents) => {
      return agents;
    },
    (err) => {
      throw err;
    }
  );
}

function getById(id) {
  console.log(`${baseUrl}/${id}`);
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params, useForm = false, useJson = true) {
  if (useForm) {
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

function search(query, offset = 0) {
  console.log(`${baseUrl}/search?${query}&offset=${offset}`);
  return fetchWrapper.get(`${baseUrl}/search?${query}&offset=${offset}`);
}

function postPaid(subscriberId, body, useJson = true) {
  return fetchWrapper.put(`${baseUrl}/paid/${subscriberId}`, body, useJson);
}

function postUnPaid(subscriberId, body, useJson = true) {
  return fetchWrapper.put(`${baseUrl}/unpaid/${subscriberId}`, body, useJson);
}

function createBatch(users, useJson = true) {
  return fetchWrapper.post(`${baseUrl}/batch`, users, useJson);
}
