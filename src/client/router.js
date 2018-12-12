import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './components/Layout';
import Game from './components/Game';

export default function getRoutes() {
	return (
		<Router history={browserHistory}>
			<Route path='/' component={Layout}>
				<IndexRoute key='route-default' component={Game} />
			</Route>
		</Router>
	);
}
