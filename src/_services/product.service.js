import { fetchWrapper, history } from '@/_helpers';
// const config = {
// 	apiUrl: 'http://localhost:3000/api/v1'
// };
const config = require('config');
const baseUrl = `${config.apiUrl}/product`;

export const productService = {
	getAll,
	getById,
	create,
	update
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
		console.log('useform', true);
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
