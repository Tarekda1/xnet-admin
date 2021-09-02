// import React, { useState, useEffect } from 'react';
// import { Route, Redirect } from 'react-router-dom';

//import { accountService } from "@/_services";

// const PrivateRoute = ({ component: Component, roles, ...rest }) => {
// 	let user = localStorage.getItem('user');
// 	console.log(user);
// 	// if (tempUser !== '') {
// 	// 	user = JSON.parse(localStorage.getItem('user'));
// 	// } else {
// 	// 	user = null;
// 	// }

// 	return (
// 		<Route
// 			{...rest}
// 			render={(props) => {
// 				//const user = accountService.userValue;
// 				if (user == undefined || user == null || (user && user.verificationToken !== undefined) || user == '') {
// 					// not logged in so redirect to login page with the return url
// 					return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
// 				}

// 				// check if route is restricted by role
// 				if (roles && roles.indexOf(user.role) === -1) {
// 					// role not authorized so redirect to home page
// 					return <Redirect to={{ pathname: '/' }} />;
// 				}

// 				// authorized so return component
// 				return <Component {...props} />;
// 			}}
// 		/>
// 	);
// };

// export { PrivateRoute };
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const token = sessionStorage.getItem('token');
	//const token = useSelector((state) => state.user.token);
	return (
		<Route
			{...rest}
			render={(props) => (token != null ? <Component {...props} /> : <Redirect to="/account/login" />)}
		/>
	);
};

export { PrivateRoute };
