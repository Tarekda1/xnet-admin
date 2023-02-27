import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';

function Products({ match }) {
	const { path } = match;

	return (
		<Switch>
			<Route exact path={path} component={List} />
			<Route path={`${path}/add`} component={AddEdit} />
		</Switch>
	);
}

export { Products };
