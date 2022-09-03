import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const client = new QueryClient()

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<QueryClientProvider client={client}>
			<React.StrictMode>
				<HashRouter>
					<Switch>
						<Route path={`/auth`} component={AuthLayout} />
						<Route path={`/admin`} component={AdminLayout} />
						<Redirect from='/' to='/admin' />
					</Switch>
				</HashRouter>
			</React.StrictMode>
		</QueryClientProvider>
	</ChakraProvider>,
	document.getElementById('root')
);