import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Details } from './Details';
import { Update } from './Update';

function Profile({ match }) {
	let { path, url } = useRouteMatch();

	return (
		<div className="p-4">
			<div className="container">
				<Switch>
					<Route exact path={path} component={Details} />
					<Route path={`${path}/update`} component={Update} />
				</Switch>
			</div>
		</div>
	);
}

export { Profile };
